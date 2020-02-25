const systemMessage = require('../../../config/systemMessage');
const commonUtil = require('../common/commonUtil');
const querySequelize = require('../../model/models.js');
const models = require('../../model/applyUserCompanyStatus/ApplyUserCompanyStatus');
const transactionSequelize = require('../../model/models.js');

require('date-utils');

exports.index = (req,res) => {

  const serialNumber = req.params.serialNumber || '';
  const applyUserId = commonUtil.getUserIdFromToken(req,res) || '';

  if(!serialNumber.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "serialNumber" , req:serialNumber});
  }

  if(!applyUserId.length){
    return res.status(400).json({error:systemMessage.search.incorrectKey + "applyUserId" , req:applyUserId});
  }

  const query = "select 'first' as priority, " +
                  "(select company.company_name from sv_companies company where company.company_id = statu.company_id) as companyName, " +
                  "statu.company_id as companyId, " +
                  "statu.document_status as documentStatus, " +
                  "statu.interview_status as interviewStatus, " +
                  "statu.final_status as finalStatus, " +
                  "statu.interview_date as interviewDate " +
                  "FROM " +
                  "sv_apply_user_company_statuses statu , sv_apply_company_choices companyChoice " +
                  "WHERE " +
                  "statu.apply_user_id =:applyUserId " +
                  "and statu.serial_number =:serialNumber " +
                  "and statu.serial_number = companyChoice.serial_number " +
                  "and statu.apply_user_id = companyChoice.apply_user_id " +
                  "and statu.company_id = companyChoice.first_company " +
                  "union all " +
                "select 'second' as priority, " +
                  "(select company.company_name from sv_companies company where company.company_id = statu.company_id) as companyName, " +
                  "statu.company_id as companyId, " +
                  "statu.document_status as documentStatus, " +
                  "statu.interview_status as interviewStatus, " +
                  "statu.final_status as finalStatus, " +
                  "statu.interview_date as interviewDate " +
                  "FROM " +
                  "sv_apply_user_company_statuses statu , sv_apply_company_choices companyChoice " +
                  "WHERE " +
                  "statu.apply_user_id =:applyUserId " +
                  "and statu.serial_number =:serialNumber " +
                  "and statu.serial_number = companyChoice.serial_number " +
                  "and statu.apply_user_id = companyChoice.apply_user_id " +
                  "and statu.company_id = companyChoice.second_company " +
                  "union all " +
                "select 'third' as priority, " +
                  "(select company.company_name from sv_companies company where company.company_id = statu.company_id) as companyName, " +
                  "statu.company_id as companyId, " +
                  "statu.document_status as documentStatus, " +
                  "statu.interview_status as interviewStatus, " +
                  "statu.final_status as finalStatus, " +
                  "statu.interview_date as interviewDate " +
                  "FROM " +
                  "sv_apply_user_company_statuses statu , sv_apply_company_choices companyChoice " +
                  "WHERE " +
                  "statu.apply_user_id =:applyUserId " +
                  "and statu.serial_number =:serialNumber " +
                  "and statu.serial_number = companyChoice.serial_number " +
                  "and statu.apply_user_id = companyChoice.apply_user_id " +
                  "and statu.company_id = companyChoice.third_company; "
  return querySequelize.query(query, {
    type: querySequelize.QueryTypes.RAW,
    replacements: { serialNumber: serialNumber, applyUserId: applyUserId}
  }).spread(function(applyUserStatus){
    console.log("결과" + applyUserStatus);
    return res.status(200).json(applyUserStatus);
  }).catch(function (err) {
      console.log(err);
      return res.status(500).json(err);
  });
};


exports.update = (req,res) => {  
  const { companyId } = req.params || '';
  const { applyList } = req.body;

  transactionSequelize.transaction(function (t) {

    let promises = [];

      for(let i=0; i<applyList.length; i++){

        const applyInfo = applyList[i];

        if(applyInfo.changeYn==="Y"){

          const applyUserId = applyInfo.applyUserId || '';
          const applyName = applyInfo.applyName || '';
          const applyBirth = applyInfo.applyBirth || '';
          const applySchool = applyInfo.applySchool || '';
          const serialNumber = applyInfo.serialNumber || '';
          const priority = applyInfo.priority || '';

          const documentStatus = applyInfo.documentStatus || '';
          const interviewStatus = applyInfo.interviewStatus || '';
          const finalStatus = applyInfo.finalStatus || '';

          if(!serialNumber.length){
            return res.status(400).json({error:systemMessage.search.incorrectKey + "serialNumber" , req:serialNumber});
          }
          if(!applyUserId.length){
            return res.status(400).json({error:systemMessage.search.incorrectKey + "applyUserId" , req:applyUserId});
          }
          if(!applyName.length){
            return res.status(400).json({error:systemMessage.search.incorrectKey + "applyName" , req:applyName});
          }
          if(!applyBirth.length){
            return res.status(400).json({error:systemMessage.search.incorrectKey + "applyBirth" , req:applyBirth});
          }
          if(!applySchool.length){
            return res.status(400).json({error:systemMessage.search.incorrectKey + "applySchool" , req:applySchool});
          }
          if(!priority.length){
            return res.status(400).json({error:systemMessage.search.incorrectKey + "priority" , req:priority});
          }

          const newDate = new Date()
          const time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

          let updatePromise = models.ApplyUserCompanyStatus.update({
                documentStatus: documentStatus,
                interviewStatus: interviewStatus,
                finalStatus: finalStatus,
                updateUserId: "admin",
                updateDatetime: time
              }, 
              {
                where: { 
                          serialNumber:serialNumber, 
                          applyUserId: applyUserId, 
                          companyId:companyId
                        },
                transaction: t
              });

          promises.push(updatePromise);

        }

      }

      return Promise.all(promises);

  }).then(function (promises) {
    res.status(201).json("update successfully");
    console.log("개인정보 업데이트 성공");
  }).catch(function (err) {
    res.status(500).json(err)
    console.log(err);
    console.log("개인정보 업데이트 실패");
  });

};

