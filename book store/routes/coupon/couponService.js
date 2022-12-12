var express = require("express");

var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  insertCoupon: async (couponInfo) => {
    try {
      const { name, type, discount } = couponInfo;
      const conn = await pool.getConnection();
      const query = `INSERT INTO coupon
            (
                name,
                type,
                created,
                end_Date,
                discount
              ) VALUES (
                    ?,
                    ?,
                    Now(),
                    DATE_ADD(Now(), INTERVAL 7 DAY),
                    ?
                 );`;
      const [{ affectRows: result }] = await conn.query(query, [
        name,
        type,

        discount,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 보유 쿠폰 불러오기
  getOwnCoupon: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT own_coupon.num, id, content,useYN,discount ,name from own_coupon left join coupon on coupon.num = own_coupon.coupon_num where user_user_num = ?
          `;
      const [result] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 사용 가능 쿠폰 불러오기
  getCanUseCoupon: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT own_coupon.num, id, content,discount ,name from own_coupon left join coupon on coupon.num = own_coupon.coupon_num where user_user_num = ? and useYN = 0
          `;
      const [result] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //쿠폰 번호 불러오기
  getCouponId: async (couponNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT id from own_coupon where num = ?
          `;
      const [result] = await conn.query(query, [couponNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //쿠폰 번호로 할인 금액 불러오기
  getCouponDiscount: async (couponId) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT discount from own_coupon left join coupon on coupon.num = own_coupon.coupon_num where own_coupon.id = ?
          `;
      const [result] = await conn.query(query, [couponId]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  //모의고사 이벤트 쿠폰 보유 번호 가져오기
  getEventCouponNum: async () => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT num from own_coupon where coupon_num = 3
          `;
      const [[result]] = await conn.query(query);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
