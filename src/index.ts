import { Elm } from "./elm/Main.elm";
import crypto from "node:crypto";
import * as TaskRunner from "./tasks";
import readline from "node:readline/promises";

// Task

const Tasks = {
  slowInt: (i) => waitRandom().then(() => i),
  getEnv: (x) => process.env[x],
  consoleTime: (label) => console.time(label),
  consoleTimeEnd: (label) => console.timeEnd(label),
};

function waitRandom() {
  return wait(crypto.randomInt(0, 500));
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// App

const { ports } = Elm.Main.init({ flags: null });

TaskRunner.register({
  tasks: Tasks,
  ports: ports,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

ask();
// fireMany();

ports.sendResult.subscribe((result) => {
  console.log(result);
  ask();
});

function fireMany() {
  for (let i = 0; i < 10; i++) {
    waitRandom().then(() => {
      ports.fireMany.send(i);
    });
  }
}

function ask() {
  rl.question("enter an attempt id: ").then((id) => {
    ports.manualEnter.send(id);
  });
}
