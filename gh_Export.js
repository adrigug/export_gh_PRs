var Promise = require('bluebird')
var GitHubApi = require("github");

const org = "ConsenSys";

var github = new GitHubApi({ Promise });

github.repos.getForOrg({ org, type: 'sources' })
  .then(res=>res.data.map(i=>i.name))
  .then(repos=>{
    return Promise.map(repos, (repo) => {
      return github.pullRequests.getAll({
        state: 'Closed',
        owner: org,
        repo
      });
    })
  })
  .then((allReposPrs) => {
    allReposPrs.forEach(thisRepoPrs=>{
      thisRepoPrs.data.forEach(pr => {
        const {
          _links,
          title,
          body,
          created_at,
          updated_at,
          user: { login },
          number,
        } = pr;
        const baseName = pr.base.repo.name;
        console.log([
          `Pull request`,
          `\tRepo: ${pr.base.repo.name}`,
          `\tAuthor: ${login}`,
          `\tTitle: ${title}`,
          `\tURL: ${_links.html.href}`,
        ].join('\n'));
      });
    })
  });