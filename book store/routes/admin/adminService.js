// const pool = require("../../config/dbConfig");
// module.exports = {
//   insertBook: async (userInfo) => {
//     try {
//       const { book_num, book_name, book_stock, book_price } = userInfo;
//       const conn = await pool.getConnection();
//       const query = `INSERT INTO bookstore
//             (
//                 book_num,
//                 book_name,
//                 book_stock,
//                 book_price,
//                 ) VALUES (
//                     ?,
//                     ?,
//                     ?,
//                     ?
//                 );`;
//       const [{ affectRows: result }] = await conn.query(query, [
//         book_num,
//         book_name,
//         book_stock,
//         book_price,
//       ]);
//       conn.release();
//       return result;
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   },
//   // getUserList: async () =>{
//   //     try{
//   //         const conn = await pool.getConnection();
//   //         const query = "SELECT * FROM t_user;";
//   //         const [result] = await conn.query(query);
//   //         conn.release();
//   //         return result;
//   //     } catch(error){
//   //          throw error;
//   //     }
//   // },
//   // updateUser: (userInfo) =>{

//   // },
//   // deleteUser: (userInfo)=>{

//   // }
// };
