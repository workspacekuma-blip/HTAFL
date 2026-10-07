export const emailAddress='htafl@africamail.com';
export const smtpHost='smtp.mail.com';
export function emailConfigured(env=process.env){
  return env.SMTP_HOST===smtpHost && env.SMTP_USER===emailAddress &&
    (!env.SMTP_FROM || env.SMTP_FROM===emailAddress) &&
    [465,587].includes(Number(env.SMTP_PORT || 465)) && !!env.SMTP_PASS;
}
export function transportSettings(env=process.env){
  const port=Number(env.SMTP_PORT || 465);
  return {host:smtpHost,port,secure:port===465,requireTLS:true,
    auth:{user:emailAddress,pass:env.SMTP_PASS},logger:false,debug:false};
}
