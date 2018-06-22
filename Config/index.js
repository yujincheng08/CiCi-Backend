export let secret = process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret';
export let mongodb = "mongodb://localhost/test";
