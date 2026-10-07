import {idPattern,privateStorage,listRecords,moderateRecord} from './storage.js';

const storage=privateStorage();
const [command,id]=process.argv.slice(2);
if(command==='list') {
  for(const r of await listRecords(storage)) {
    console.log(JSON.stringify({id:r.id,title:r.title,status:r.status,publicationConsent:r.publicationConsent,notification:r.notification,createdAt:r.createdAt}));
  }
} else if(['approve','withdraw','reject'].includes(command)&&idPattern.test(id || '')) {
  await moderateRecord(storage,id,command);
  console.log(command==='approve'?`Approved ${id}. Only the public credit and work details enter the gallery.`:`Removed ${id} from storage and publication.`);
} else {
  console.log('Usage: npm run review -- list | approve <id> | reject <id> | withdraw <id>');
  process.exitCode=1;
}
