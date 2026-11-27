import { expect, jest } from '@jest/globals';
import request from 'supertest';

 const mockSave = jest.fn();
  const mockModelProducts = jest.fn().mockImplementation((datos) => ({
      ...datos,
      save: mockSave,
  }));

  mockModelProducts.find = jest.fn();
  mockModelProducts.findById = jest.fn();
  mockModelProducts.findByIdAndUpdate = jest.fn();
  mockModelProducts.findByIdAndDelete = jest.fn();

  jest.unstable_mockModule('../src/models/modelProduct.js', () => ({
      default: mockModelProducts,
  }));


  const mockUploadSingleImage = jest.fn((req, res, cb) => {
    req.file = { filename: 'imagen_prueba.png' };
    cb(null);
});

const mockUploadUserImage = jest.fn((req, res, cb) => {
    req.file = { filename: 'usuario_prueba.png' };
    cb(null);
});

jest.unstable_mockModule('../src/middleware/uploadImage.js', () => ({
    uploadSingleImage: mockUploadSingleImage,
    uploadUserImage: mockUploadUserImage,
}));


  const { default: modelProducts } = await import('../src/models/modelProduct.js');
  const { default: servidor } = await import('../src/server.js');

describe('PRUEBA DE INTEGRACION: Rutas /products (Estilo postman)', ()=>{
        beforeEach(() =>{
            jest.clearAllMocks();
        });
 test('GET / products status 200', async () =>{
            //ARRANGE 
            const productosMock =[
                {
                    _id: '123',  
                    category: 'Salud y Nutrición', 
                    description:'descripción de producto prueba', 
                    price: 230000, 
                    rating: 5, 
                    numberOfReviews: 15,  
                    images: 'analgesico.jpg', 
                    stock:200
                }
            ];
            modelProducts.find.mockResolvedValue(productosMock);
            //Act 
            const respuesta = await request(servidor).get('/products').send();
            //Assert
            expect(respuesta.statusCode).toBe(200);
            expect(respuesta.headers['content-type']).toMatch(/json/);
            expect(respuesta.body).toEqual({
                message: `Productos encontrados exitosamente`,
                data:productosMock
            });
        });

        });