const Redis = require("ioredis");
const Crypto = require("crypto");
const Fs = require("fs");

exports.setRedis = (path, labels) => {
    const key = md5Sum(path);
    const json = JSON.stringify(labels);

    (async (key, json) => {
        const redis = new Redis();
        await redis.set(key, json);
        await redis.disconnect();
    })(key, json);
};

exports.getRedis = (path) => {
    const key = md5Sum(path);

    return (async (key) => {
        const redis = new Redis();
        const json = await redis.get(key);
        await redis.disconnect();

        if (json == null) {
            return {};
        }

        return value = JSON.parse(json);
    })(key);
};

function md5Sum(path) {
    const target = Fs.readFileSync(path);
    const md5Hash = Crypto.createHash("md5");
    md5Hash.update(target);

    return md5Hash.digest("hex");
}
