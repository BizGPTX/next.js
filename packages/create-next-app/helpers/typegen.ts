/* eslint-disable import/no-extraneous-dependencies */
import spawn from 'cross-spawn'

/**
 * Runs `next typegen` using the locally installed Next.js binary.
 * Assumes the current working directory is the project root where Next is installed.
 */
export async function runTypegen(): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ['node_modules/next/dist/bin/next', 'typegen'],
      {
        stdio: 'inherit',
        env: {
          ...process.env,
        },
      }
    )

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`next typegen exited with code ${code}`))
        return
      }
      resolve()
    })
  })
}
