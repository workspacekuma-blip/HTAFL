import {scrypt,randomBytes,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
const derive=promisify(scrypt);
const options={N:32768,r:8,p:1,maxmem:64*1024*1024};
export const validHash=value=>/^scrypt-v1:[a-f0-9]{32}:[a-f0-9]{128}$/.test(value || '');
export async function hashPassword(password) {
  if(typeof password!=='string' || password.length<16 || password.length>256)throw Error('Use an administrator passphrase with 16–256 characters.');
  const salt=randomBytes(16).toString('hex');
  const hash=await derive(password,salt,64,options);
  return `scrypt-v1:${salt}:${hash.toString('hex')}`;
}
export async function verifyPassword(password,encoded) {
  if(typeof password!=='string' || password.length>256 || !validHash(encoded))return false;
  const [,salt,expected]=encoded.split(':');
  const actual=await derive(password,salt,64,options);
  return timingSafeEqual(actual,Buffer.from(expected,'hex'));
}
