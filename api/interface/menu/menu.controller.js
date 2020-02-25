const models = require('../../model/menu/Menu');
const systemMessage = require('../../../config/systemMessage');

exports.index = (req,res) => {
  //추후 내가 쓴 문의사항만 보여주도록 변경 필요, 인증정보 나오면
    return models.Menu.findAll()
    .then(applys => res.json(applys))
    .catch(function (err) {
        console.log(err);
        return res.status(500).json(err);
    });
};

exports.show = (req,res) => {
  const id = req.params.id || '';

  if(!id.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "id", req:id});
  }

models.Menu.findOne({
    where: {
      id: id,
    }
  }).then(menu => {
      if (!menu){
        return res.status(404).json({error:systemMessage.search.targetMissing});
      }
      return res.json(menu);
    }).catch(function (err) {
        console.log(err);
        return res.status(500).json(err);
    });
};
