export async function copyShareText(text: string): Promise<{ok:boolean;message:string}> {
  try {
    await navigator.clipboard.writeText(text);
    return {ok:true,message:'복사했습니다.'};
  } catch {
    return {ok:false,message:'복사하지 못했습니다. 브라우저 권한을 확인해 주세요.'};
  }
}
export async function shareGame(data:ShareData):Promise<string> {
  if(typeof navigator.share==='function') {
    try {await navigator.share(data);return '공유했습니다.';}
    catch(error) {if(error instanceof Error&&error.name==='AbortError')return '';}
  }
  return (await copyShareText(`${data.text || ''}\n${data.url || ''}`)).message;
}
