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

// Prueba 3 readProductById 
    test('readProductById debe responder con el producto encontrado', async () => {
        // ARRANGE (preparar)
        const productoMock = {
            _id: 'id556',
            nombre: 'Concentrado',
            precio: 50000,
        };
        modelProduct.findById.mockResolvedValue(productoMock);
        const req = { params: { id: 'id556' } };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.readProductById(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: `El Producto con el ID: ${productoMock._id} fue encontrado`,
            data: productoMock,
        });
    });

    // Prueba 4 readProductById (Catch)
    test('readProductById debe responder con mensaje de error si falla la bd', async () => {
        // ARRANGE (preparar)
        const simulatedError = new Error('Fallo buscando el producto por ID');
        modelProduct.findById.mockRejectedValue(simulatedError);
        const req = { params: { id: 'id556' } };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.readProductById(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: `Ocurrió un error encontrando el producto con el ID:${req.params.id}`,
            data: simulatedError,
        });
    });

    // Prueba 5 productUpdate (Camino feliz)
    test('productUpdate debe actualizar el producto exitosamente', async () => {
        // ARRANGE
        const productoExistente = {
            _id: 'id556',
            product: 'Concentrado viejo',
            images: 'img_vieja.png',
        };
        const productoActualizado = {
            _id: 'id556',
            product: 'Concentrado nuevo',
            category: 'alimento',
            description: 'Para perros',
            price: 60000,
            rating: 5,
            numberOfReviews: 10,
            images: 'img_vieja.png',
            stock: 20,
        };

        modelProduct.findById.mockResolvedValue(productoExistente);
        modelProduct.findByIdAndUpdate.mockResolvedValue(productoActualizado);

        const req = {
            params: { id: 'id556' },
            body: {
                product: 'Concentrado nuevo',
                category: 'alimento',
                description: 'Para perros',
                price: 60000,
                rating: 5,
                numberOfReviews: 10,
                stock: 20,
            },
        };
        const res = { json: jest.fn() };

        // ACT
        await controllerProduct.productUpdate(req, res);

        // ASSERT
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto actualizado exitosamente.',
            data: productoActualizado,
        });
    });

    // Prueba 6 productUpdate (Producto no encontrado)
    test('productUpdate debe responder "Producto no encontrado" si no existe el id', async () => {
        // ARRANGE
        modelProduct.findById.mockResolvedValue(null);
        const req = { params: { id: 'id999' }, body: {} };
        const res = { json: jest.fn() };

        // ACT
        await controllerProduct.productUpdate(req, res);

        // ASSERT
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto no encontrado',
            data: null,
        });
    });

    // Prueba 7 productUpdate (Catch)
    test('productUpdate debe responder con mensaje de error si falla la bd', async () => {
        // ARRANGE
        const simulatedError = new Error('Fallo actualizando el producto');
        modelProduct.findById.mockRejectedValue(simulatedError);
        const req = { params: { id: 'id556' }, body: {} };
        const res = { json: jest.fn() };

        // ACT
        await controllerProduct.productUpdate(req, res);

        // ASSERT
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ocurrio un error al actualizar el producto.',
            data: simulatedError.message,
        });
    });

    



});
