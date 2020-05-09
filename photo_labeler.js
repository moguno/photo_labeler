#! /usr/bin/env node

const Program = require("commander");
const RedisIO = require("./redisio");

async function add(labelName, path) {
    const labels = await RedisIO.getRedis(path);

    const newLabel = {};

    newLabel.lastModified = Date.now();
    
    labels[labelName] = newLabel;

    await RedisIO.setRedis(path, labels);
}

async function exists(labelName, path) {
    const labels = await RedisIO.getRedis(path);

    return (labelName in labels);
}

async function get(path) {
    const labels = await RedisIO.getRedis(path);

    return Object.keys(labels);
}

async function del(labelName, path) {
    const labels = await RedisIO.getRedis(path);

    delete labels[labelName];

    await RedisIO.setRedis(path, labels);
}

////// Entry Point
Program.command("add <label> <path>")
    .action(add);

Program.command("exists <label> <path>")
    .action((labelName, path) => {
        exists(labelName, path).then(result => {
            if (!result) {
                console.error("label \"" + labelName + "\" is not found.");
                process.exit(1);
            }
        });
    });

Program.command("get <path>")
    .action(path => {
        get(path).then(result => {
            console.log(result.join("\n"));
        });
    });

Program.command("delete <label> <path>")
    .action((labelName, path) => {
        del(labelName, path);
    })

Program.parse(process.argv);