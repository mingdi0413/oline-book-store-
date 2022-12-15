var express = require("express");

var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  //유저 등록
  insertUser: async (userInfo) => {
    try {
      const { user_name, user_id, user_password, user_phone } = userInfo;
      const conn = await pool.getConnection();
      const query = `INSERT INTO User
            (
              user_name,
              user_id,
              user_password,
              user_phone,

              user_point
              ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    0

                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        user_name,
        user_id,
        user_password,
        user_phone,
      ]);

      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //로그인 할 경우 유저 아이디 조회
  checkUser: async (userInfo) => {
    try {
      console.log(userInfo);
      const { id, pw } = userInfo;
      const conn = await pool.getConnection();
      const query = "select * from User where user_id = ?;";

      const [result] = await conn.query(query, [id]);
      conn.release();
      const { user_password } = result[0];

      if (user_password === pw) {
        return result[0];
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //card등록
  insertCard: async (cardInfo, userNum) => {
    try {
      const { card_valid_date, card_type, card_id } = cardInfo;
      const conn = await pool.getConnection();
      const query = `INSERT INTO Card
            (
              card_valid_date,
              card_type,
              User_user_num,
              card_id
              ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?
                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        card_valid_date,
        card_type,
        userNum,
        card_id,
      ]);

      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //주소 등록
  insertAddress: async (addressInfo, userNum) => {
    try {
      const { zip_code, default_address, detail_address } = addressInfo;
      const conn = await pool.getConnection();
      const query = `INSERT INTO address
            (
              zip_code,
              default_address,
              detail_address,
              User_user_num
              ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?
                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        zip_code,
        default_address,
        detail_address,
        userNum,
      ]);

      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 포인트 추가
  plusPoint: async (price, userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            update User set user_point = user_point+? where user_num = ?
          `;
      await conn.query(query, [price, userNum]);
      conn.release();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // UserPoint 받아오기
  getUserPoint: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT user_point from user
          WHERE user_num = ?
        `;
      const [result] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //리뷰 작성
  insertReview: async ({
    book_num,
    book_order_num,
    review_content,
    star_rating,
    userNum,
  }) => {
    try {
      const conn = await pool.getConnection();
      const query = `INSERT INTO review
            (
                content,
                createDate,
                star_rating,
                user_user_num,
                book_book_num,
                book_order_num

              ) VALUES (
                    ?,
                    NOW(),
                    ?,
                    ?,
                    ?,
                    ?   
                );`;
      const [{ affectRows: result }] = await conn.query(query, [
        review_content,
        star_rating,
        userNum,
        book_num,
        book_order_num,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //게시글 작성
  insertPost: async ({ title, content, userNum, board_num, event_num }) => {
    try {
      const conn = await pool.getConnection();
      const query = `INSERT INTO post
              (
                title,
                content,
                createdAt,
                user_user_num,
                board_num,
                event_num
            
                ) VALUES (
                      ?,
                      ?,
                      NOW(),
                      ?,
                      ?,
                      ?
                      
                  );`;
      const [{ affectRows: result }] = await conn.query(query, [
        title,
        content,
        userNum,
        board_num,
        event_num,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 전체 게시판가져오기
  getAllBoard: async () => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT category from board 
        `;
      const [result] = await conn.query(query);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // category로 게시판 번호 가져오기
  getBoardNum: async (category) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT num from board where category = ?
        `;
      const [result] = await conn.query(query, [category]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 진행중인 이벤트 가져오기
  getIngEvent: async () => {
    try {
      const conn = await pool.getConnection();
      const query = `
      SELECT * from event where NOW()<end_Date; 
        `;
      const [result] = await conn.query(query);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // category로 게시판 번호 가져오기
  getBoardNum: async (category) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT num from board where category = ?
        `;
      const [result] = await conn.query(query, [category]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 해당 카테고리 게시글 가져오기
  getBoardCategory: async (boardNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT num, title, content, createdAt, recommended, user_name name from post left join user on post.user_user_num = user.user_num where board_num = ?
        order by createdAt DESC
        `;
      const [result] = await conn.query(query, [boardNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 진행중인 이벤트 게시글 가져오기
  getIngPost: async (postNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
      SELECT post.num,title,user_user_num,createdAt,recommended from post left join event on post.event_num = event.num where NOW()<end_Date and start_Date < NOW() and post.num = ?; 
        `;
      const [result] = await conn.query(query, [postNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 전체 게시글 불러오기
  getAllPost: async () => {
    try {
      const conn = await pool.getConnection();
      const query = `
      SELECT num, title, content, createdAt, recommended,  user_name name from post left join user on post.user_user_num = user.user_num
        order by createdAt DESC
      `;
      const [result] = await conn.query(query);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 실시간 이벤트 게시글 순위 불러오기
  getEventPostRank: async () => {
    try {
      const conn = await pool.getConnection();
      const query = `
      SELECT title FROM post WHERE event_num is not NULL order by recommended desc limit 10;
      `;
      const [result] = await conn.query(query);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 게시글 정보 불러오기
  getPostDetail: async (postTitle) => {
    try {
      const conn = await pool.getConnection();
      const query = `
      SELECT num, title, content, createdAt, recommended, user_name name from post left join user on post.user_user_num = user.user_num where title = ?
        order by createdAt DESC
      `;
      const [result] = await conn.query(query, [postTitle]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // userNum으로 게시글 작성자 가져오기
  getPostOwner: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT user_name from user where user_num = ?
        `;
      const [result] = await conn.query(query, userNum);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // userNum으로 게시글 추천수 증가
  addPostRecommend: async (postNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
      update post set recommended = recommended + 1 where num = ?
        `;
      const [result] = await conn.query(query, postNum);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
