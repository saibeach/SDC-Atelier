import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
  stages: [
    {duration: '15s', target: 100},
    {duration: '30s', target: 100},
    {duration: '15s', target: 0},
  ],
};


export default function() {

  let res = http.get('http://localhost:3000/api/questions');
  check(res, {'status was 200': r => r.status=200 });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "questions.html": htmlReport(data),
  };
}

