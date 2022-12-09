const pool = require("../../config/dbConfig");
module.exports = {
  insertBook: async (userInfo) => {
    try {
      const { book_num, book_name, book_stock, book_price } = userInfo;
      const conn = await pool.getConnection();
      const query = `INSERT INTO bookstore
            (
                book_num,
                book_name,
                book_stock,
                book_price,
                ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?
                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        book_num,
        book_name,
        book_stock,
        book_price,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 쿠폰 부여하기
  giveCoupon: async (couponInfo) => {
    try {
      const { id, content, user_user_num, coupon_num } = couponInfo;
      const conn = await pool.getConnection();
      const query = `
          Insert into own_coupon (id, content, user_user_num, coupon_num) values(?,?,?,?); 
          `;
      const [result] = await conn.query(query, [
        id,
        content,
        user_user_num,
        coupon_num,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
