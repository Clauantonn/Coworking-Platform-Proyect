//hacer filtro de tipo de oficinas

// import getPool from '../../db/getPool.js';
// import generateErrorUtil from '../../utils/generateErrorUtil.js';

// const filterWorkSpaceOffice = async (req, res, next) => {
//     try {
//         const pool = await getPool();
//         const { workspace } = req.params;

//         const [offices] = await pool.query(
//             `SELECT * FROM offices WHERE workspace = OFFICE`,
//             [workspace],
//         );
//         const [desk] = await pool.query(
//             `SELECT * FROM offices WHERE workspace = DESK`,
//             [workspace],
//         );

//         if (offices.length < 1 && desk.length < 1) {
//             generateErrorUtil('No se encontraron oficinas', 404);
//         }

//         res.send({
//             status: 'ok',
//             data: offices,
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// export default filterWorkSpaceOffice;

//si esto esta bien se mete en router.js
