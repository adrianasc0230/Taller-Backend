import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 1. Simular Multer (uploadSingleImage) ejecuta el callback sin exigir el archivo real
jest.unstable_mockModule('../src/middleware/uploadImage.js', () => ({
    uploadSingleImage: jest.fn((req, res, callback) => callback(null)),
}));

// 2. Simular fs (sistema de archivos) para pruebas con imágenes
const mockFs = {
    existsSync: jest.fn(),
    unlinkSync: jest.fn(),
    promises: {
        readFile: jest.fn(),
        unlink: jest.fn(),
    },
};

jest.unstable_mockModule('fs', () => ({
    default: mockFs,
}));

// 3. Simular el modelo de Mongoose
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

const { uploadSingleImage } = await import('../src/middleware/uploadImage.js');
const { default: modelProduct } = await import('../src/models/modelProduct.js');
const { default: controllerProduct } = await import('../src/controller/controllerProduct.js');

describe('PRUEBA UNITARIA AGROANIMA: ControllerProduct.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Prueba 1 readProducts 
    test('readProducts debe responder message: "Productos encontrados exitosamente"', async () => {
        // ARRANGE (preparar)
        const productosMock = [
            { _id: '1', product: 'Concentrado', price: 50000 },
            { _id: '2', product: 'Juguete', price: 15000 },
        ];
        modelProduct.find.mockResolvedValue(productosMock);
        const sol = { query: {} };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.readProducts(sol, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Productos encontrados exitosamente',
            data: productosMock,
        });
    });

    // Prueba 2 readProducts (Catch)
    test('readProducts debe responder message: "No se pudo encontrar los productos" si falla la bd', async () => {
        // ARRANGE (preparar)
        const simulatedError = new Error('Fallo de conexion a Mongo');
        modelProduct.find.mockRejectedValue(simulatedError);
        const sol = { query: {} };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.readProducts(sol, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'No se pudo encontrar los productos',
            data: simulatedError,
        });
    });

    // Prueba 3 readProductById 
    test('readProductById debe responder con el producto encontrado', async () => {
        // ARRANGE (preparar)
        const productoMock = {
            _id: 'id556',
            product: 'Concentrado',
            price: 50000,
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

    // Prueba 5 productUpdate (sin imagen nueva)
    test('productUpdate debe actualizar el producto exitosamente sin imagen nueva', async () => {
        // ARRANGE (preparar)
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

        // ACT (actuar)
        await controllerProduct.productUpdate(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto actualizado exitosamente.',
            data: productoActualizado,
        });
    });

    // Prueba 6 productUpdate (imagen nueva)
    test('productUpdate debe procesar la nueva imagen si viene req.file', async () => {
        // ARRANGE (preparar)
        const productoExistente = { _id: 'id556', images: 'img_vieja.png' };
        const productoActualizado = { _id: 'id556', product: 'Nuevo' };

        modelProduct.findById.mockResolvedValue(productoExistente);
        modelProduct.findByIdAndUpdate.mockResolvedValue(productoActualizado);
        mockFs.promises.readFile.mockResolvedValue(Buffer.from('nueva-img'));
        mockFs.promises.unlink.mockResolvedValue();

        const req = {
            params: { id: 'id556' },
            file: { path: 'ruta/nueva.png', mimetype: 'image/png' },
            body: { product: 'Nuevo' },
        };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productUpdate(req, res);

        // ASSERT (verificar)
        expect(mockFs.promises.readFile).toHaveBeenCalledWith('ruta/nueva.png');
        expect(mockFs.promises.unlink).toHaveBeenCalledWith('ruta/nueva.png');
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto actualizado exitosamente.',
            data: productoActualizado,
        });
    });

    // Prueba 7 productUpdate (Producto no encontrado sin imagen)
    test('productUpdate debe responder "Producto no encontrado" si no existe el id', async () => {
        // ARRANGE (preparar)
        modelProduct.findById.mockResolvedValue(null);
        const req = { params: { id: 'id999' }, body: {} };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productUpdate(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto no encontrado',
            data: null,
        });
    });

    // Prueba 8 productUpdate (Producto no encontrado con imagen temporal)
    test('productUpdate debe borrar la imagen temporal si el producto no existe', async () => {
        // ARRANGE (preparar)
        modelProduct.findById.mockResolvedValue(null);
        const req = {
            params: { id: 'id999' },
            file: { path: 'ruta/temp.png' },
            body: {},
        };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productUpdate(req, res);

        // ASSERT (verificar)
        expect(mockFs.unlinkSync).toHaveBeenCalledWith('ruta/temp.png');
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto no encontrado',
            data: null,
        });
    });

    // Prueba 9 productUpdate (Catch)
    test('productUpdate debe responder con mensaje de error si falla la bd', async () => {
        // ARRANGE (preparar)
        const simulatedError = new Error('Fallo actualizando el producto');
        modelProduct.findById.mockRejectedValue(simulatedError);
        const req = { params: { id: 'id556' }, body: {} };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productUpdate(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ocurrio un error al actualizar el producto.',
            data: simulatedError.message,
        });
    });

    // Prueba 10 productDelete (sin imagen)
    test('productDelete debe eliminar el producto exitosamente sin imagen', async () => {
        // ARRANGE (preparar)
        const productoEliminado = {
            _id: 'id556',
            product: 'Concentrado',
        };
        modelProduct.findByIdAndDelete.mockResolvedValue(productoEliminado);
        const req = { params: { id: 'id556' } };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productDelete(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'producto eliminado exitosamente',
            data: productoEliminado,
        });
    });

    // Prueba 11 productDelete (imagen en disco)
    test('productDelete debe eliminar la imagen del disco si existe', async () => {
        // ARRANGE (preparar)
        const productoEliminado = { _id: 'id556', images: 'foto.png' };
        modelProduct.findByIdAndDelete.mockResolvedValue(productoEliminado);
        mockFs.existsSync.mockReturnValue(true);

        const req = { params: { id: 'id556' } };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productDelete(req, res);

        // ASSERT (verificar)
        expect(mockFs.existsSync).toHaveBeenCalled();
        expect(mockFs.unlinkSync).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: 'producto eliminado exitosamente',
            data: productoEliminado,
        });
    });

    // Prueba 12 productDelete (Producto no encontrado)
    test('productDelete debe responder "producto no encontrado" si no existe el id', async () => {
        // ARRANGE (preparar)
        modelProduct.findByIdAndDelete.mockResolvedValue(null);
        const req = { params: { id: 'id999' } };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productDelete(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'producto no encontrado',
            data: null,
        });
    });

    // Prueba 13 productDelete (Catch)
    test('productDelete debe responder con mensaje de error si falla la bd', async () => {
        // ARRANGE (preparar)
        const simulatedError = new Error('Fallo eliminando el producto');
        modelProduct.findByIdAndDelete.mockRejectedValue(simulatedError);
        const req = { params: { id: 'id556' } };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productDelete(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'error al eliminar el producto',
            data: simulatedError,
        });
    });

   // Prueba 14 productCreate 
    test('productCreate debe guardar el producto exitosamente', async () => {
        // ARRANGE (preparar)
        const productoGuardado = { _id: '123', product: 'Concentrado' };
        mockFs.promises.readFile.mockResolvedValue(Buffer.from('imagen-falsa'));
        mockFs.promises.unlink.mockResolvedValue();
        mockSave.mockResolvedValue(productoGuardado);
        uploadSingleImage.mockImplementation((req, res, cb) => cb(null));

        const req = {
            file: { path: 'ruta/falsa.png', mimetype: 'image/png' },
            body: {
                product: 'Concentrado',
                category: 'alimento',
                description: 'Para perro',
                price: 50000,
                rating: 5,
                numberOfReviews: 2,
                stock: 10,
            },
        };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productCreate(req, res);
        await new Promise((resolve) => setTimeout(resolve, 0));

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto guardado',
            data: productoGuardado,
        });
    });

    // Prueba 15 productCreate (Error en uploadSingleImage)
    test('productCreate debe responder error si falla uploadSingleImage', async () => {
        // ARRANGE (preparar)
        const errorUpload = new Error('Error subiendo imagen');
        mockFs.promises.readFile.mockResolvedValue(Buffer.from('imagen-falsa'));
        mockFs.promises.unlink.mockResolvedValue();
        mockSave.mockResolvedValue({});
        uploadSingleImage.mockImplementation((req, res, cb) => cb(errorUpload));

        const req = {
            file: { path: 'ruta/falsa.png', mimetype: 'image/png' },
            body: {},
        };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productCreate(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ocurrio un error cargando la imagen.',
            data: errorUpload,
        });
    });

    // Prueba 16 productCreate (Catch)
    test('productCreate debe responder error en el catch si falla de forma inesperada', async () => {
        // ARRANGE (preparar)
        const simulatedError = new Error('Error inesperado');
        uploadSingleImage.mockImplementation(() => {
            throw simulatedError;
        });

        const req = {};
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productCreate(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ocurrio un error al guardar el producto',
            data: simulatedError,
        });
    });

    // Prueba 17 readProductById (Branch línea 67: producto sin _id)
    test('readProductById no debe llamar res.json si el producto no tiene _id', async () => {
        // ARRANGE (preparar)
        modelProduct.findById.mockResolvedValue({});
        const req = { params: { id: 'id556' } };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.readProductById(req, res);

        // ASSERT (verificar)
        expect(res.json).not.toHaveBeenCalled();
    });

    // Prueba 18 productUpdate (Branch línea 157: error sin propiedad message)
    test('productUpdate debe devolver el error completo si no tiene message', async () => {
        // ARRANGE (preparar)
        const errorSinMessage = 'Error en texto plano';
        modelProduct.findById.mockRejectedValue(errorSinMessage);
        const req = { params: { id: 'id556' }, body: {} };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productUpdate(req, res);

        // ASSERT (verificar)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ocurrio un error al actualizar el producto.',
            data: errorSinMessage,
        });
    });

    // Prueba 19 productDelete (Branch línea 184: imagen no existe en disco)
    test('productDelete no debe llamar unlinkSync si la imagen no existe en disco', async () => {
        // ARRANGE (preparar)
        const productoEliminado = { _id: 'id556', images: 'foto_inexistente.png' };
        modelProduct.findByIdAndDelete.mockResolvedValue(productoEliminado);
        mockFs.existsSync.mockReturnValue(false);

        const req = { params: { id: 'id556' } };
        const res = { json: jest.fn() };

        // ACT (actuar)
        await controllerProduct.productDelete(req, res);

        // ASSERT (verificar)
        expect(mockFs.existsSync).toHaveBeenCalled();
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: 'producto eliminado exitosamente',
            data: productoEliminado,
        });
    });


});




