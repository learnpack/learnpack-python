const fs = require('fs');
const { python } = require('compile-run');
const { Utils, CompilationError } = require('learnpack/plugin')
const { checkPython3 } = require('./utils.js');

module.exports = {
  validate: async () => {
    if(!checkPython3()) throw Error(`You need to have python3 installed to run test the exercises`)
    return true
  },
  run: async function ({ exercise, socket }) {

    let entryPath = exercise.files.map(f => './'+f.path).find(f => f.includes(exercise.entry || 'app.py'));
    if(!entryPath) throw new Error("No entry file to compile, maybe you need to create an app.py in the exercise directory?");

    const content = fs.readFileSync(entryPath, "utf8");
    const count = Utils.getMatches(/^(?:[^\/])+input\s*\(\s*(?:["'`]{1}(.*)["'`]{1})?\s*\)\s*/gm, content);
    let inputs = (count.length == 0) ? [] : await socket.ask(count);
    
    const result = await python.runFile(entryPath, { stdin: inputs.join('\n'), executionPath: 'python3' })
    if(result.exitCode > 0) throw CompilationError(result.stderr);
    return cleanStdout(result.stdout, inputs)
    
  },
}

const cleanStdout = (buffer, inputs) => {

  // if(Array.isArray(inputs))
  //   for(let i = 0; i < inputs.length; i++)
  //     if(inputs[i]) buffer = buffer.replace(inputs[i],'');

  return buffer;
}