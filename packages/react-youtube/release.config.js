module.exports = {
  extends: 'semantic-release-monorepo',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/github',
      {
        assets: ['dist/**'],
        releasedLabels: ['Status: Released'],
      },
    ],
    '@semantic-release/npm',
  ],
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'master',
    'next',
    'next-major',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
    { name: 'canary', prerelease: true },
  ],
  tagFormat: `v\${version}`,
};
