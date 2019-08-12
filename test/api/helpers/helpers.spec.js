// import { scientificToDecimal, getNewId } from '../../../server/api/helpers/helpers';
// // Lines#10,54,42,47
// describe('api/helpers/helpers.js', () => {
//
//   context('#getNewId', () => {
//     it('1', () => {
//       getNewId.should.be.a('function');
//
//       const case1 = getNewId([]);
//
//       case1.should.eql(1);
//     });
//   });
//
//   context('#scientificToDecimal', () => {
//     it('number', () => {
//       scientificToDecimal.should.be.a('function');
//
//       const case1 = scientificToDecimal(1.232e-10);
//       const case2 = scientificToDecimal(1.232e+21);
//       const case3 = scientificToDecimal(1.232222222e+5);
//       const case4 = scientificToDecimal(1);
//
//       case1.should.be.a('string');
//       case1.should.eql('0.0000000001232');
//       case2.should.be.a('string');
//       case2.should.eql('1232000000000000000000');
//       case3.should.be.a('number');
//       case3.should.eql(123222.2222);
//       case4.should.be.a('number');
//       case4.should.eql(1);
//     });
//   });
// });
