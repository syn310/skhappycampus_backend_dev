const models = require('../../model/qna/Qna');
const querySequelize = require('../../model/models.js');
const systemMessage = require('../../../config/systemMessage');
const commonUtil = require('../common/commonUtil');
const sequelize = require("sequelize");
const Op = sequelize.Op;

exports.create = (req,res) => {
  const questionType = req.body.questionType || '';
  const questionTitle = req.body.questionTitle || '';
  const questionContent = req.body.questionContent || '';
  const applyUserId = commonUtil.getUserIdFromToken(req,res) || '';

  if(!questionType.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "questionType" , req:questionType});
  }

  if(!questionTitle.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "questionTitle" , req:questionTitle});
  }

  if(!questionContent.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "questionContent" , req:questionContent});
  }

  if(!applyUserId.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "applyUserId" , req:applyUserId});
  }

  const newDate = new Date()
  const time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS')

  return models.Qna.create({
      qnaCategory: questionType,
      qnaTitle: questionTitle,
      qnaQuestion: questionContent,
      createUserId: applyUserId,
      createDatetime: time,
      updateUserId: applyUserId,
      updateDatetime: time
  }).then((Qna) => res.status(201).json(Qna))
  .catch(function (err) {
      return res.status(500).json(err)
  });
};

exports.index = (req,res) => {
  const userId = commonUtil.getUserIdFromToken(req,res) || '';
  if(!userId.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "userId" , req:userId});
  }
    return models.Qna.findAll({
      where : { 
        deleteYn : "N" ,
        createUserId: userId
      },
      order: [['createDatetime', 'DESC']]
    })
    .then(qnas => res.json(qnas))
    .catch(function (err) {
        console.log(err);
        return res.status(500).json(err);
    });
};

exports.show = (req,res) => {
  const qnaSeq = req.params.qnaSeq || '';
  const userId = commonUtil.getUserIdFromToken(req,res) || '';
  if(!qnaSeq.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "qnaSeq" , req:qnaSeq});
  }
  if(!userId.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "userId" , req:userId});
  }

  models.Qna.findOne({
    where: {
      qnaSeq: qnaSeq,
      createUserId: userId
    }
  }).then(qna => {
      if (!qna){
        return res.status(404).json({error: systemMessage.search.targetMissing});
      }
      return res.json(qna);
    }).catch(function (err) {
        console.log(err);
        res.status(500).json(err)
    });
};

// exports.delete = (req,res) => {
//   const qnaSeq = req.params.qnaSeq || '';
//   const userId = "ADMIN"; //나중에 토큰에서 빼서 사용

//   if(!qnaSeq.length){
//     return res.status(400).json({error:systemMessage.search.incorrectKey + "qnaSeq" , req:qnaSeq});
//   }

//   const newDate = new Date()
//   const time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

//   models.Qna.update({
//       deleteYn: "Y",
//       updateDatetime: time,
//       updateUserId: userId
//   } , {
//         where: {
//           qnaSeq: qnaSeq
//         }
//   }).then(()=>{
//       return models.Qna.findOne({
//         where: {
//           qnaSeq: qnaSeq
//         }
//      });
//    }).then((qna) => {
//      if(qna == null) {
//        res.status(404).json(systemMessage.search.targetMissing)
//      }else{
//        res.status(200).json(qna)
//      }
//     })
//    .catch(function (err) {
//        res.status(500).json(err)
//    });
// };

// exports.qnaAnswer = (req,res) => {
//   const qnaSeq = req.params.qnaSeq || '';
//   const qnaAnswer = req.body.qnaInfo.qnaAnswer || '';
//   const userId = "ADMIN"; //나중에 토큰에서 빼서 사용

//   if(!qnaSeq.length){
//     return res.status(400).json({error:systemMessage.search.incorrectKey + "qnaSeq" , req:qnaSeq});
//   }

//   if(!qnaAnswer.length){
//     return res.status(400).json({error:systemMessage.search.incorrectKey + "qnaAnswer" , req:qnaAnswer});
//   }

//   const newDate = new Date()
//   const time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

//   models.Qna.update({
//       qnaAnswer: qnaAnswer,
//       answerYn: "Y",
//       answerDatetime: time
//   } , {
//         where: {
//           qnaSeq: qnaSeq
//         }
//   }).then(()=>{
//       return models.Qna.findOne({
//         where: {
//           qnaSeq: qnaSeq
//         }
//      });
//    }).then((qna) => {
//      if(qna == null) {
//        res.status(404).json(systemMessage.search.targetMissing)
//      }else{
//        res.status(200).json(qna)
//      }
//     })
//    .catch(function (err) {
//        res.status(500).json(err)
//    });
// };

// exports.checkNewQna = (req,res) => {
//   return models.Qna.findAll({
//     where : { deleteYn : "N" , answerYn:"N"},
//     order: [['qnaCategory', 'DESC']]
//   })
//   .then(qnas => {

//     if (qnas.length < 1){
//       return res.json("N")
//     }

//     return res.json("Y");
//   })
//   .catch(function (err) {
//       console.log(err);
//       return res.status(500).json(err);
//   });
// };

