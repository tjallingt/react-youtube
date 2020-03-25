module.exports = {
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
  branches: ['master', { name: 'canary', prerelease: true }],
};
