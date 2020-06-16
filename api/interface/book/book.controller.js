const models = require('../../model/book/Book');
const systemMessage = require('../../../config/systemMessage');
const querySequelize = require('../../model/models.js');
const commonUtil = require('../common/commonUtil');
require('date-utils');

// 책 리스트 조회
exports.index = (req,res) => {
    return models.Book.findAll({
      where : {
        chooserId: null
      },
      order: [['bookId', 'ASC']]
    })
    .then(books => res.json(books))
    .catch(function (err) {
        console.log(err);
        return res.status(500).json(err);
    });
};

// 특정 책 상세정보 조회
exports.show = (req, res) => {
  const bookId = req.params.bookId || '';

  if(!bookId.length) {
    return res.status(400).json({error:systemMessage.search.incorrectKey + "bookId", req:bookId});
  }

  return models.Book.findOne({
    where : {
      bookId: bookId,
    }
  }).then(book => {
    if(!book){
      return res.status(404).json({error:systemMessage.search.targetMissing});
    } else {
      return res.json(book);
    }
  }).catch(function(err) {
    console.log(err);
    return res.status(500).json(err);
  });
}

// 특정 사용자의 찜 목록 조회
exports.chooserBookList = (req, res) => {
  const chooserId = commonUtil.getUserIdFromToken(req,res) || '';

  if(!chooserId.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "chooserId" , req:chooserId});
  }

  return models.Book.findAll({
    where : {
      chooserId: chooserId,
    }
  })
  .then(myBooks => res.json(myBooks))
  .catch(function(err) {
    console.log(err);
    return res.status(500).json(err);
  });

}

// 찜한 사용자 ID를 NULL 처리하여 책 정보에 업데이트
exports.cancelUpdate = (req, res) => {
  const bookId = req.params.bookId || '';

  const newDate = new Date()
  const time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

  return models.Book.update({
    chooserId: null,
    updateDatetime: time,
    chooseDatetime: null
  }, {
    where: {
      bookId: bookId
    }
  }).then(() => {
    return models.Book.findOne({
      where: {
        bookId: bookId
      }
    });
  }).then((book) => {
    if(!book){
      return res.status(404).json(systemMessage.delete.targetMissing);
    }else{
      return res.status(200).json(book);
    }
  }).catch(function(err) {
    console.log(err);
    return res.status(500).json(err);
  });
}

// 찜하기 사용자 ID를 책 정보에 업데이트
exports.chooserUpdate = (req, res) => {
  const bookId = req.params.bookId || '';
  const chooserId = commonUtil.getUserIdFromToken(req,res) || '';

  const newDate = new Date()
  const time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

  return models.Book.update({
    chooserId: chooserId,
    updateDatetime: time,
    chooseDatetime: time
  }, {
    where: {
      bookId: bookId
    }
  }).then(() => {
    return models.Book.findOne({
      where: {
        bookId: bookId,
        chooserId: chooserId
      }
    });
  }).then((book) => {
    if(!book){
      return res.status(404).json(systemMessage.delete.targetMissing);
    }else{
      return res.status(200).json(book);
    }
  }).catch(function(err) {
    console.log(err);
    return res.status(500).json(err);
  });
}