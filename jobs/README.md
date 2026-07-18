# jobs

Scheduled / background jobs (cron tasks, queue workers). Mirrors the layout of
the Recibia server.

Convention: an `index.js` registers jobs; individual jobs live in `*.jobs.js`
and reusable pieces in `modules/`.
