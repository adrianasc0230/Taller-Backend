import {beforeEach, describe, expect, jest, test} from '@jest/globals';


jest.unstable_mockModule('../src/middleware/uploadImage.js', ()=>({
 uploadSingleImage: jest.fn((req, res, callback)=>callback(null)),
}));

const mockSave = jest.fn();
const mockModelProducts = jest.fn().mockImplementation((datos)=>({
    ...datos,
    save: mockSave
}));

mockModelProducts.find = jest.fn();
mockModelProducts.findById = jest.fn();          
mockModelProducts.findByIdAndUpdate = jest.fn();  
mockModelProducts.findByIdAndDelete = jest.fn();  

jest.unstable_mockModule('../src/models/modelProduct.js', ()=>({
    default: mockModelProducts,
}));

const {uploadSingleImage} = await import ('../src/middleware/uploadImage.js')
const {default : modelProduct}= await import ('../src/models/modelProduct.js')
const {default: controllerProduct}= await import('../src/controller/controllerProduct.js')

describe('PRUEBA UNITARIA AGROANIMA: ControllerProduct.js',()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });

//ARRANGE

    test('readProducts debe responder message: `El Producto con el ID: fue encontrado', async()=>{

const testProducts =[
    { _id: '123',  category: 'Salud y Nutrición', description:'descripción de producto prueba', price: 230000, rating: 5, numberOfReviews: 15,  images: 'analgesico.jpg', stock:200},
    { _id: '345',  category: 'Bienestar Animal', description:'descripción de producto prueba2', price: 180000, rating: 5, numberOfReviews: 0,  images: 'vitaminas.jpg', stock:0},
];
modelProduct.find.mockResolvedValue(testProducts);
 const req ={query:{}};
 const res = {json: jest.fn()};
//ACT (actuar)
await controllerProduct.readProducts(req, res);
//ASSERT (verificar)
    expect(modelProduct.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
        message: `Productos encontrados exitosamente`,
        data: testProducts,
            });

    });
})
