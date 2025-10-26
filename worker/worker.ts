import { verifyAndUpdateMovements } from "./service/verifyMovement";

verifyAndUpdateMovements();

const intervalId = setInterval(verifyAndUpdateMovements, 30000);

process.on('SIGINT', () => {
    console.log('\nRecibida señal SIGINT, terminando worker...');
    clearInterval(intervalId);
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nRecibida señal SIGTERM, terminando worker...');
    clearInterval(intervalId);
    process.exit(0);
});