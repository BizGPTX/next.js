use anyhow::{Context, Result};
use turbo_rcstr::{RcStr, rcstr};
use turbo_tasks::{ResolvedVc, Vc};
use turbo_tasks_fs::{self, FileSystemEntryType, FileSystemPath, to_sys_path};
use turbopack::module_options::{LoaderRuleItem, OptionWebpackRules, WebpackRules};
use turbopack_core::issue::{Issue, IssueSeverity, IssueStage, OptionStyledString, StyledString};
use turbopack_node::transforms::webpack::WebpackLoaderItem;

const BABEL_CONFIG_FILES: &[&str] = &[
    ".babelrc",
    ".babelrc.json",
    ".babelrc.js",
    ".babelrc.mjs",
    ".babelrc.cjs",
    "babel.config.js",
    "babel.config.json",
    "babel.config.mjs",
    "babel.config.cjs",
];

/// The upstream version of babel-loader from NPM. This is what a user would likely use if they
/// manually configured babel-loader themselves.
const UPSTREAM_BABEL_LOADER: &str = "babel-loader";

/// The forked version of babel-loader that we should use for automatic configuration. This version
/// is always available, as it's installed as part of next.js.
const NEXT_JS_BABEL_LOADER: &str = "next/dist/build/babel/loader";

/// A system path that can be passed to the webpack loader
async fn to_sys_path_str(path: FileSystemPath) -> Result<String> {
    let sys_path = to_sys_path(path)
        .await?
        .context("path should use a DiskFileSystem")?;
    Ok(sys_path
        .to_str()
        .with_context(|| "{sys_path:?} is not valid utf-8")?
        .to_owned())
}

/// If the user has a babel configuration file (see list above) alongside their
/// `next.config.js` configuration, automatically add `babel-loader` as a
/// webpack loader for each eligible file type if it doesn't already exist.
#[turbo_tasks::function]
pub async fn maybe_add_babel_loader(
    project_root: FileSystemPath,
    webpack_rules: Option<ResolvedVc<WebpackRules>>,
) -> Result<Vc<OptionWebpackRules>> {
    let mut babel_config_path = None;
    for &filename in BABEL_CONFIG_FILES {
        let path = project_root.join(filename)?;
        let filetype = *path.get_type().await?;
        if matches!(filetype, FileSystemEntryType::File) {
            babel_config_path = Some(path);
            break;
        }
    }

    let Some(babel_config_path) = babel_config_path else {
        return Ok(Vc::cell(webpack_rules));
    };

    let mut rules = if let Some(webpack_rules) = webpack_rules {
        webpack_rules.owned().await?
    } else {
        Default::default()
    };

    // - See `packages/next/src/build/babel/loader/types.d.ts` for all the configuration options.
    // - See `packages/next/src/build/get-babel-loader-config.ts` for how we use this in webpack.
    let mut loader_options = serde_json::Map::new();

    // `transformMode: default` (what the webpack implementation does) would run all of the
    // Next.js-specific transforms as babel transforms. Because we always have to pay the cost
    // of parsing with SWC after the webpack loader runs, we want to keep running those
    // transforms using SWC, so use `standalone` instead.
    loader_options.insert("transformMode".to_owned(), "standalone".into());

    loader_options.insert(
        "cwd".to_owned(),
        to_sys_path_str(project_root).await?.into(),
    );
    loader_options.insert(
        "configFile".to_owned(),
        to_sys_path_str(babel_config_path).await?.into(),
    );

    let mut has_changed = false;
    for pattern in ["*.js", "*.jsx", "*.ts", "*.tsx", "*.cjs", "*.mjs"] {
        let rule = rules.get_mut(pattern);
        let has_babel_loader = if let Some(rule) = rule.as_ref() {
            rule.loaders
                .await?
                .iter()
                .any(|c| c.loader == UPSTREAM_BABEL_LOADER || c.loader == NEXT_JS_BABEL_LOADER)
        } else {
            false
        };

        if !has_babel_loader {
            let loader = WebpackLoaderItem {
                loader: rcstr!(NEXT_JS_BABEL_LOADER),
                options: loader_options.clone(),
            };
            if let Some(rule) = rule {
                let mut loaders = rule.loaders.owned().await?;
                loaders.push(loader);
                rule.loaders = ResolvedVc::cell(loaders);
            } else {
                rules.insert(
                    RcStr::from(pattern),
                    LoaderRuleItem {
                        loaders: ResolvedVc::cell(vec![loader]),
                        rename_as: Some(rcstr!("*")),
                    },
                );
            }
            has_changed = true;
        }
    }

    if has_changed {
        return Ok(Vc::cell(Some(ResolvedVc::cell(rules))));
    }
    Ok(Vc::cell(webpack_rules))
}

#[turbo_tasks::value]
struct BabelIssue {
    path: FileSystemPath,
    title: ResolvedVc<StyledString>,
    description: ResolvedVc<StyledString>,
    severity: IssueSeverity,
}

#[turbo_tasks::value_impl]
impl Issue for BabelIssue {
    #[turbo_tasks::function]
    fn stage(&self) -> Vc<IssueStage> {
        IssueStage::Transform.into()
    }

    fn severity(&self) -> IssueSeverity {
        self.severity
    }

    #[turbo_tasks::function]
    fn file_path(&self) -> Vc<FileSystemPath> {
        self.path.clone().cell()
    }

    #[turbo_tasks::function]
    fn title(&self) -> Vc<StyledString> {
        *self.title
    }

    #[turbo_tasks::function]
    fn description(&self) -> Vc<OptionStyledString> {
        Vc::cell(Some(self.description))
    }
}
