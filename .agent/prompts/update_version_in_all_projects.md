new version: <NEW VERSION>
Update (and --save-dev) all packages in ~/persistance/private/dev/*/** that use claudekit, install the newly published claudekit.
Its possible npm wont install the new version yet, this can happen just after a publish, then keep trying to install untill it succeeds and wait 10 sec in between (max 25 attempts).