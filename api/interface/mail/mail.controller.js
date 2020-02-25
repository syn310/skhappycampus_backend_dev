const models = require('../../model/menu/Menu');
const systemMessage = require('../../../config/systemMessage');
const config = require('../../../config/environments');
const commonUtil = require('../common/commonUtil');

exports.sendMail = (req,res) => {
  //const applyUserId = commonUtil.getUserIdFromToken(req,res) || '';
  const templateNumber = req.params.templateNumber || '';
  const mailTo = req.body.mailTo || ''; 
  const name = req.body.name || ''; 
  const mailSubject = req.body.mailSubject || ''; 
  const mailContents = req.body.mailContents || ''; 

 // if(!applyUserId.length){
 //   return res.status(400).json({error:systemMessage.search.incorrectKey + "applyUserId" , req:applyUserId});
 // }

  if(!mailTo.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "mailTo" , req:mailTo});
  }

  if(!name.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "name" , req:name});
  }

  if(!mailSubject.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "mailSubject" , req:mailSubject});
  }

  if(!mailContents.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "mailContents" , req:mailContents});
  }

  let mailData = {
    "mailTo" : mailTo,
    "name" : name,
    "mailSubject" : mailSubject,
    "mailContents" : mailContents
  };

  let url = config.resturl.mailserver + "/" + templateNumber;

  return commonUtil.sendMailFromServer(url, mailData, function(err, result, status){
    if(!err){
      var returnMsg = JSON.stringify(result);
      console.log("결과값 : " + JSON.stringify(returnMsg));
      return res.status(200).json(returnMsg);
    }else{
      return res.status(500).json({error:systemMessage.mail.error});
    }
  });
};