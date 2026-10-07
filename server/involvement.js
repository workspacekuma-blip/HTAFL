import pathwayContent from '../content/involvement-pathways.json' with {type:'json'};
export const pathways=pathwayContent;
const emailPattern=/^[^\s@<>,;"\r\n]+@[^\s@<>,;"\r\n]+\.[^\s@<>,;"\r\n]+$/;
export function validateInvolvement(body) {
  const schema=pathways[body.interest],fields={},values={};
  if(!Object.hasOwn(pathways,body.interest || ''))return {fields:{interest:'Choose a valid involvement pathway.'},values};
  for(const field of schema.fields) {
    const value=typeof body[field.name]==='string'?body[field.name].trim():'';
    values[field.name]=value;
    if(field.type==='select') {
      if((field.required && !value) || (value && !field.options.some(([key])=>key===value)))fields[field.name]='Choose one of the listed options.';
    } else {
      if(value.length<field.min || value.length>field.max || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value))fields[field.name]=`Use ${field.min}–${field.max} characters.`;
      if(field.type==='email' && !emailPattern.test(value))fields[field.name]='Enter a valid email address.';
      if(field.type==='url' && value) {
        try{const url=new URL(value);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error();}
        catch{fields[field.name]='Use a full http(s) URL without sign-in details.';}
      }
    }
  }
  if(body.consent!==true)fields.consent='Consent is required to respond.';
  return {fields,values};
}
export function involvementMessage(interest,values) {
  return [`Pathway: ${interest}`,...pathways[interest].fields.map(field=>{
    const value=values[field.name];
    const readable=field.type==='select'?field.options.find(([key])=>key===value)?.[1]:value;
    return `${field.label}: ${readable || 'Not provided'}`;
  }),'Response consent: Yes'].join('\n\n');
}
