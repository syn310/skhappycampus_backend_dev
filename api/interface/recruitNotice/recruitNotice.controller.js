const models = require('../../model/recruitNotice/RecruitNotice');
const querySequelize = require('../../model/models.js');
const systemMessage = require('../../../config/systemMessage');
const commonUtil = require('../common/commonUtil');

exports.index = (req,res) => {
  return models.RecruitNotice.findAll({
      where: {
        delete_yn: 'N',
        notice_status: ['진행중', '종료'] 
      }
  })
  .then(recruitNotices => res.json(recruitNotices))
  .catch(function (err) {
      console.log(err);
      return res.status(500).json(err);
  });
};

exports.show = (req,res) => {
  const serialNumber = req.params.serialNumber || '';

  if(!serialNumber.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "serialNumber" , req:serialNumber});
  }


  return models.RecruitNotice.findOne({
    where: {
      serialNumber: serialNumber
    }
  }).then(recruitNotice => {
      if (!recruitNotice){
        return res.status(404).json({error:systemMessage.search.targetMissing});
      }
      return res.json(recruitNotice);
    }).catch(function (err) {
        console.log(err);
        return res.status(500).json(err);
    });
  };

// exports.destroy = (req, res) => {
//   const serialNumber = req.params.serialNumber || '';
//
//   if(!serialNumber.length){
//     return res.status(400).json({error:systemMessage.search.incorrectKey + "serialNumber" , req:serialNumber});
//   }
//
//   return models.RecruitNotice.findOne({
//     where: {
//       serialNumber: serialNumber
//     }
//   }).then((recruitNotice)=>{
//     if(recruitNotice == null){
//       return res.status(404).json(systemMessage.search.targetMissing);
//     }else{
//       return models.RecruitNotice.destroy({
//         where: {
//           serialNumber: serialNumber
//         }
//       }).then(() => res.status(200).json(systemMessage.delete.success))
//       .catch(function (err) {
//             return res.status(500).json(err);
//       });
//     }
//   })
// };

exports.create = (req,res) => {
  const serialNumber = req.body.serialNumber || '';
  const noticeName = req.body.noticeName || '';
  const noticeStartDatetime = commonUtil.transDateFormat(req.body.noticeStartDatetime) || '';
  const noticeEndDatetime = commonUtil.transDateFormat(req.body.noticeEndDatetime) || '';
  const studyStartDate = commonUtil.transDateFormat(req.body.studyStartDate) || '';
  const studyEndDate = commonUtil.transDateFormat(req.body.studyEndDate) || '';
  const internStartDate = commonUtil.transDateFormat(req.body.internStartDate) || '';
  const internEndDate = commonUtil.transDateFormat(req.body.internEndDate) || '';
  const noticeStatus = req.body.noticeStatus || '';
  const noticeImagePath = req.body.noticeImagePath || '';
  const createUserId = req.body.createUserId || '';
  const updateUserId = req.body.updateUserId || '';

  if(!serialNumber.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "serialNumber" , req:serialNumber});
  }

  if(!noticeName.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "noticeName" , req:noticeName});
  }

  if(!noticeStartDatetime.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "noticeStartDatetime" , req:noticeStartDatetime});
  }

  if(!noticeEndDatetime.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "noticeEndDatetime" , req:noticeEndDatetime});
  }

  if(!noticeStatus.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "noticeStatus" , req:noticeStatus});
  }

  return models.RecruitNotice.create({
    serialNumber : serialNumber,
    noticeName : noticeName,
    noticeStartDatetime : noticeStartDatetime,
    noticeEndDatetime : noticeEndDatetime,
    studyStartDate : studyStartDate,
    studyEndDate : studyEndDate,
    internStartDate : internStartDate,
    internEndDate : internEndDate,
    noticeStatus : noticeStatus,
    noticeImagePath : noticeImagePath,
    createUserId : createUserId,
    updateUserId : updateUserId
  }).then((recruitNotice) => res.status(201).json(recruitNotice))
  .catch(function (err) {
      console.log(err);
      return res.status(500).json(err);
  });
};

// exports.update = (req,res) => {
//   const serialNumber = req.params.serialNumber || '';
//   const noticeName = req.body.noticeName || '';
//   const noticeStartDatetime = req.body.noticeStartDatetime || '';
//   const noticeEndDatetime = req.body.noticeEndDatetime || '';
//   const studyStartDate = req.body.studyStartDate || '';
//   const studyEndDate = req.body.studyEndDate || '';
//   const internStartDate = req.body.internStartDate || '';
//   const internEndDate = req.body.internEndDate || '';
//   const noticeStatus = req.body.noticeStatus || '';
//   const noticeImagePath = req.body.noticeImagePath || '';
//   const createUserId = req.body.createUserId || '';
//   const updateUserId = req.body.updateUserId || '';
//
//   if(!serialNumber.length){
//     return res.status(400).json({error:systemMessage.search.incorrectKey + "serialNumber" , req:serialNumber});
//   }
//
//   if(!noticeName.length){
//     return res.status(400).json({error:systemMessage.search.incorrectKey + "noticeName" , req:noticeName});
//   }
//
//   if(!noticeStartDatetime.length){
//     return res.status(400).json({error:systemMessage.search.incorrectKey + "noticeStartDatetime" , req:noticeStartDatetime});
//   }
//
//   if(!noticeEndDatetime.length){
//     return res.status(400).json({error:systemMessage.search.incorrectKey + "noticeEndDatetime" , req:noticeEndDatetime});
//   }
//
//   if(!noticeStatus.length){
//     return res.status(400).json({error:systemMessage.search.incorrectKey + "noticeStatus" , req:noticeStatus});
//   }
//
//   const newDate = new Date()
//   const time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
//
//   return models.RecruitNotice.update({
//     noticeName : noticeName,
//     noticeStartDatetime : noticeStartDatetime,
//     noticeEndDatetime : noticeEndDatetime,
//     studyStartDate : studyStartDate,
//     studyEndDate : studyEndDate,
//     internStartDate : internStartDate,
//     internEndDate : internEndDate,
//     noticeStatus : noticeStatus,
//     noticeImagePath : noticeImagePath,
//     createUserId : createUserId,
//     updateUserId : updateUserId,
//     updateDatetime: time
//   } , {
//     where: {
//       serialNumber: serialNumber,
//     }
//   }).then(()=>{
//       return models.RecruitNotice.findOne({
//         where: {
//           serialNumber: serialNumber
//         }
//      });
//    }).then((recruitNotice) => {
//      if(recruitNotice == null) {
//        return res.status(404).json(systemMessage.search.targetMissing);
//      }else{
//        return res.status(200).json(recruitNotice);
//      }
//     })
//    .catch(function (err) {
//        return res.status(500).json(err);
//    });
// };
