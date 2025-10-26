import { runMockLoop } from './kernel';

const task = process.env.TASK || 'add a README section';
runMockLoop(task, 3).then((res) => {
  console.log('=== Mock Orchestrator Run ===');
  console.log(JSON.stringify(res, null, 2));
  if (res.status === 'CONVERGED') {
    console.log('CONVERGED');
    process.exit(0);
  } else {
    console.error('FAILED');
    process.exit(1);
  }
});
