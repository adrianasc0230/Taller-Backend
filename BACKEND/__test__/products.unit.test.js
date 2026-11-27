import {beforeEach, describe, expect, jest, test} from '@jest/globals';

//1. Simular Multer (uploadSingleImage )ejecuta el callback sin exigir elarchivo real
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


//Prueba 1 readProducts find
    test('readProducts debe responder message: `El Producto con el ID: fue encontrado', async()=>{

// ARRANGE (preparar)
const testProducts =[
    { _id: '123',  category: 'Salud y Nutrición', description:'descripción de producto prueba', price: 230000, rating: 5, numberOfReviews: 15,  images: 'analgesico.jpg', stock:200},
    { _id: '345',  category: 'Bienestar Animal', description:'descripción de producto prueba2', price: 180000, rating: 5, numberOfReviews: 0,  images: 'vitaminas.jpg', stock:0},
];
// programamos que devolvera mongoDB falso cuando llamen a find()
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

// Prueba 2  readProducts (catch)
test('readProduct debe responder message: "No se pudo encontrar los producto" si falla la bd', async()=>{
    //ARRANGE (preparar)
    const simulatedError = new Error('Fallo de coneccion a Mongo');
    modelProduct.find.mockRejectedValue(simulatedError);
    const req = {query: {}};
    const res = { json: jest.fn()};

    // ACT
    await controllerProduct.readProducts(req, res);

    //ASSERT
    expect(res.json).toHaveBeenCalledWith({
        message:'No se pudo encontrar los productos',
        data: simulatedError,
    });

});
});
