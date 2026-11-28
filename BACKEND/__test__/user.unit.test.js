import { beforeEach, describe, expect, jest, test } from '@jest/globals';


const mockFs = { existsSync: jest.fn(), unlinkSync: jest.fn() };
jest.unstable_mockModule('fs', () => ({ default: mockFs }));


const mockBcrypt = { hash: jest.fn() };
jest.unstable_mockModule('bcryptjs', () => ({ default: mockBcrypt }));


const mockSendMail = jest.fn();
const mockCreateTransport = jest.fn(() => ({ sendMail: mockSendMail }));
jest.unstable_mockModule('nodemailer', () => ({
    default: { createTransport: mockCreateTransport },
}));


const mockSave = jest.fn();
const mockModelUser = jest.fn().mockImplementation((datos) => ({
    ...datos,
    save: mockSave,
}));
mockModelUser.find = jest.fn();
mockModelUser.findById = jest.fn();
mockModelUser.findOne = jest.fn();
mockModelUser.findByIdAndUpdate = jest.fn();
mockModelUser.findByIdAndDelete = jest.fn();

jest.unstable_mockModule('../src/models/modelUsuer.js', () => ({
    default: mockModelUser,
}));

const { default: modelUsuer } = await import('../src/models/modelUsuer.js');
const { default: controllerUsers, forgotPassword } = await import(
    '../src/controller/controllerUser.js'
);

describe('PRUEBA UNITARIA AGROANIMA: ControllerUser.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

       
    test('createUser debe crear el usuario con imagen y rol enviados', async () => {
        // ARRANGE
        const usuarioGuardado = { _id: 'u1', rol: 'admin' };
        mockBcrypt.hash.mockResolvedValue('hash123');
        mockSave.mockResolvedValue(usuarioGuardado);
        const req = {
            body: { name: 'Ana', email: 'ana@mail.com', rol: 'admin', password: '1234', idCard: '100', telefono: '300' },
            file: { filename: 'foto.png' },
        };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.createUser(req, res);

        // ASSERT
        expect(mockBcrypt.hash).toHaveBeenCalledWith('1234', 12);
        expect(modelUsuer).toHaveBeenCalledWith(
            expect.objectContaining({ password: 'hash123', image: 'images/users/foto.png', rol: 'admin' })
        );
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario creado exitosamente con el rol de: admin',
            data: usuarioGuardado,
        });
    });

    
    test('createUser debe usar imagen por defecto y rol "user" si no se envían', async () => {
        // ARRANGE
        const usuarioGuardado = { _id: 'u2', rol: 'user' };
        mockBcrypt.hash.mockResolvedValue('hash123');
        mockSave.mockResolvedValue(usuarioGuardado);
        const req = { body: { name: 'Luis', email: 'luis@mail.com', password: '1234' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.createUser(req, res);

        // ASSERT
        expect(modelUsuer).toHaveBeenCalledWith(
            expect.objectContaining({ rol: 'user', image: 'images/users/logindefault.png' })
        );
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario creado exitosamente con el rol de: user',
            data: usuarioGuardado,
        });
    });

    
    test('createUser no debe llamar res.json si el usuario guardado no tiene _id', async () => {
        // ARRANGE
        mockBcrypt.hash.mockResolvedValue('hash123');
        mockSave.mockResolvedValue({});
        const req = { body: { name: 'Eva', email: 'eva@mail.com', password: '1234' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.createUser(req, res);

        // ASSERT
        expect(res.json).not.toHaveBeenCalled();
    });

    
    test('createUser debe borrar la imagen subida si falla y el archivo existe', async () => {
        // ARRANGE
        const simulatedError = new Error('Fallo al hashear');
        mockBcrypt.hash.mockRejectedValue(simulatedError);
        mockFs.existsSync.mockReturnValue(true);
        const req = { body: { password: '1234' }, file: { filename: 'foto.png' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.createUser(req, res);

        // ASSERT
        expect(mockFs.unlinkSync).toHaveBeenCalledWith('images/users/foto.png');
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ocurrio un error creando el usuario',
            data: simulatedError,
        });
    });

    
    test('createUser no debe borrar nada si falla y no hay archivo', async () => {
        // ARRANGE
        const simulatedError = new Error('Fallo al hashear');
        mockBcrypt.hash.mockRejectedValue(simulatedError);
        const req = { body: { password: '1234' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.createUser(req, res);

        // ASSERT
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ocurrio un error creando el usuario',
            data: simulatedError,
        });
    });
        // Prueba 6 readUsers (éxito)
    test('readUsers debe responder con los usuarios encontrados', async () => {
        // ARRANGE
        const usuariosMock = [
            { _id: '1', name: 'Ana', email: 'ana@mail.com' },
            { _id: '2', name: 'Luis', email: 'luis@mail.com' },
        ];
        modelUsuer.find.mockResolvedValue(usuariosMock);
        const req = {};
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.readUsers(req, res);

        // ASSERT
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuarios encontrados exitosamente',
            data: usuariosMock,
        });
    });

    // Prueba 7 readUsers (catch)
    test('readUsers debe responder mensaje de error si falla la bd', async () => {
        // ARRANGE
        const simulatedError = new Error('Fallo de conexion a Mongo');
        modelUsuer.find.mockRejectedValue(simulatedError);
        const req = {};
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.readUsers(req, res);

        // ASSERT
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ocurrió un error al encontrar los usuarios',
            data: simulatedError,
        });
    });

    // Prueba 8 readUserId (éxito)
    test('readUserId debe responder con el usuario encontrado', async () => {
        // ARRANGE
        const usuarioMock = { _id: 'u1', name: 'Ana' };
        modelUsuer.findById.mockResolvedValue(usuarioMock);
        const req = { params: { id: 'u1' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.readUserId(req, res);

        // ASSERT
        expect(modelUsuer.findById).toHaveBeenCalledWith('u1');
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario encontrado',
            data: usuarioMock,
        });
    });

    // Prueba 9 readUserId (branch: usuario sin _id)
    test('readUserId no debe llamar res.json si el usuario no tiene _id', async () => {
        // ARRANGE
        modelUsuer.findById.mockResolvedValue({});
        const req = { params: { id: 'u1' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.readUserId(req, res);

        // ASSERT
        expect(res.json).not.toHaveBeenCalled();
    });

    // Prueba 10 readUserId (catch por error de bd)
    test('readUserId debe responder mensaje de error si falla la bd', async () => {
        // ARRANGE
        const simulatedError = new Error('Fallo buscando el usuario');
        modelUsuer.findById.mockRejectedValue(simulatedError);
        const req = { params: { id: 'u1' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.readUserId(req, res);

        // ASSERT
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ha ocurrido un error al encontrar el usuario',
            data: simulatedError,
        });
    });

    // Prueba 11 readUserId (id inexistente: documenta el fallo actual)
    test('readUserId cae en el catch si el id no existe (findById devuelve null)', async () => {
        // ARRANGE
        modelUsuer.findById.mockResolvedValue(null);
        const req = { params: { id: 'id999' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.readUserId(req, res);

        // ASSERT
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Ha ocurrido un error al encontrar el usuario',
            })
        );
    });
        // Prueba 12 deleteUser (imagen propia que existe en disco)
    test('deleteUser debe borrar el usuario y su imagen si existe en disco', async () => {
        // ARRANGE
        const usuarioEliminado = { _id: 'u1', image: 'images/users/foto.png' };
        modelUsuer.findByIdAndDelete.mockResolvedValue(usuarioEliminado);
        mockFs.existsSync.mockReturnValue(true);
        const req = { params: { id: 'u1' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.deleteUser(req, res);

        // ASSERT
        expect(mockFs.unlinkSync).toHaveBeenCalledWith('images/users/foto.png');
        expect(res.json).toHaveBeenCalledWith({
            message: 'El usuario con el ID:u1 ha sido borrado',
            data: null,
        });
    });

    // Prueba 13 deleteUser (imagen por defecto: nunca se borra)
    test('deleteUser no debe borrar la imagen si es la imagen por defecto', async () => {
        // ARRANGE
        const usuarioEliminado = { _id: 'u1', image: 'images/users/logindefault.png' };
        modelUsuer.findByIdAndDelete.mockResolvedValue(usuarioEliminado);
        const req = { params: { id: 'u1' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.deleteUser(req, res);

        // ASSERT
        expect(mockFs.existsSync).not.toHaveBeenCalled();
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: 'El usuario con el ID:u1 ha sido borrado',
            data: null,
        });
    });

    // Prueba 14 deleteUser (imagen propia que no está en disco)
    test('deleteUser no debe llamar unlinkSync si la imagen no existe en disco', async () => {
        // ARRANGE
        const usuarioEliminado = { _id: 'u1', image: 'images/users/foto.png' };
        modelUsuer.findByIdAndDelete.mockResolvedValue(usuarioEliminado);
        mockFs.existsSync.mockReturnValue(false);
        const req = { params: { id: 'u1' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.deleteUser(req, res);

        // ASSERT
        expect(mockFs.existsSync).toHaveBeenCalledWith('images/users/foto.png');
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    // Prueba 15 deleteUser (usuario sin imagen)
    test('deleteUser debe borrar el usuario sin tocar el disco si no tiene imagen', async () => {
        // ARRANGE
        modelUsuer.findByIdAndDelete.mockResolvedValue({ _id: 'u1' });
        const req = { params: { id: 'u1' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.deleteUser(req, res);

        // ASSERT
        expect(mockFs.existsSync).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: 'El usuario con el ID:u1 ha sido borrado',
            data: null,
        });
    });

    // Prueba 16 deleteUser (catch: también cubre el id inexistente, null._id)
    test('deleteUser debe responder mensaje de error si falla la bd', async () => {
        // ARRANGE
        const simulatedError = new Error('Fallo eliminando el usuario');
        modelUsuer.findByIdAndDelete.mockRejectedValue(simulatedError);
        const req = { params: { id: 'u1' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.deleteUser(req, res);

        // ASSERT
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ocurrió un error eliminando el usuario con el ID:u1',
            data: simulatedError,
        });
    });
    
        // Prueba 17 updateUser (sin contraseña ni archivo)
    test('updateUser debe actualizar sin hashear si no viene contraseña ni archivo', async () => {
        // ARRANGE
        const actualizado = { _id: 'u1', name: 'Ana Nueva' };
        modelUsuer.findByIdAndUpdate.mockResolvedValue(actualizado);
        const req = { params: { id: 'u1' }, body: { name: 'Ana Nueva' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(mockBcrypt.hash).not.toHaveBeenCalled();
        expect(modelUsuer.findByIdAndUpdate).toHaveBeenCalledWith(
            'u1', { name: 'Ana Nueva' }, { new: true }
        );
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario actualizado exitosamente',
            data: actualizado,
        });
    });

    // Prueba 18 updateUser (con contraseña)
    test('updateUser debe hashear la contraseña nueva antes de actualizar', async () => {
        // ARRANGE
        const actualizado = { _id: 'u1' };
        mockBcrypt.hash.mockResolvedValue('hash-nuevo');
        modelUsuer.findByIdAndUpdate.mockResolvedValue(actualizado);
        const req = { params: { id: 'u1' }, body: { password: 'nueva123' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(mockBcrypt.hash).toHaveBeenCalledWith('nueva123', 12);
        expect(modelUsuer.findByIdAndUpdate).toHaveBeenCalledWith(
            'u1', { password: 'hash-nuevo' }, { new: true }
        );
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario actualizado exitosamente',
            data: actualizado,
        });
    });

    // Prueba 19 updateUser (branch: resultado sin _id)
    test('updateUser no debe llamar res.json si el usuario actualizado no tiene _id', async () => {
        // ARRANGE
        modelUsuer.findByIdAndUpdate.mockResolvedValue({});
        const req = { params: { id: 'u1' }, body: { name: 'Ana' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(res.json).not.toHaveBeenCalled();
    });

    // Prueba 20 updateUser (archivo + imagen propia que existe)
    test('updateUser debe borrar la imagen anterior y guardar la nueva', async () => {
        // ARRANGE
        const actualizado = { _id: 'u1' };
        modelUsuer.findById.mockResolvedValue({ _id: 'u1', image: 'images/users/vieja.png' });
        modelUsuer.findByIdAndUpdate.mockResolvedValue(actualizado);
        mockFs.existsSync.mockReturnValue(true);
        const req = { params: { id: 'u1' }, body: {}, file: { filename: 'nueva.png' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(mockFs.unlinkSync).toHaveBeenCalledWith('images/users/vieja.png');
        expect(modelUsuer.findByIdAndUpdate).toHaveBeenCalledWith(
            'u1', { image: 'images/users/nueva.png' }, { new: true }
        );
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario actualizado exitosamente',
            data: actualizado,
        });
    });

    // Prueba 21 updateUser (archivo + currentUser nulo)
    test('updateUser debe guardar la imagen nueva sin borrar nada si el usuario actual es nulo', async () => {
        // ARRANGE
        modelUsuer.findById.mockResolvedValue(null);
        modelUsuer.findByIdAndUpdate.mockResolvedValue({ _id: 'u1' });
        const req = { params: { id: 'u1' }, body: {}, file: { filename: 'nueva.png' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(mockFs.existsSync).not.toHaveBeenCalled();
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
        expect(modelUsuer.findByIdAndUpdate).toHaveBeenCalledWith(
            'u1', { image: 'images/users/nueva.png' }, { new: true }
        );
    });

    // Prueba 22 updateUser (archivo + usuario sin imagen)
    test('updateUser no debe borrar nada si el usuario actual no tiene imagen', async () => {
        // ARRANGE
        modelUsuer.findById.mockResolvedValue({ _id: 'u1' });
        modelUsuer.findByIdAndUpdate.mockResolvedValue({ _id: 'u1' });
        const req = { params: { id: 'u1' }, body: {}, file: { filename: 'nueva.png' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(mockFs.existsSync).not.toHaveBeenCalled();
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    // Prueba 23 updateUser (archivo + imagen por defecto)
    test('updateUser no debe borrar la imagen por defecto', async () => {
        // ARRANGE
        modelUsuer.findById.mockResolvedValue({ _id: 'u1', image: 'images/users/logindefault.png' });
        modelUsuer.findByIdAndUpdate.mockResolvedValue({ _id: 'u1' });
        const req = { params: { id: 'u1' }, body: {}, file: { filename: 'nueva.png' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(mockFs.existsSync).not.toHaveBeenCalled();
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    // Prueba 24 updateUser (archivo + imagen propia que no está en disco)
    test('updateUser no debe llamar unlinkSync si la imagen anterior no existe en disco', async () => {
        // ARRANGE
        modelUsuer.findById.mockResolvedValue({ _id: 'u1', image: 'images/users/vieja.png' });
        modelUsuer.findByIdAndUpdate.mockResolvedValue({ _id: 'u1' });
        mockFs.existsSync.mockReturnValue(false);
        const req = { params: { id: 'u1' }, body: {}, file: { filename: 'nueva.png' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(mockFs.existsSync).toHaveBeenCalledWith('images/users/vieja.png');
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    // Prueba 25 updateUser (catch con archivo que existe)
    test('updateUser debe borrar la imagen nueva si falla y el archivo existe', async () => {
        // ARRANGE
        const simulatedError = new Error('Fallo actualizando');
        modelUsuer.findById.mockResolvedValue(null);
        modelUsuer.findByIdAndUpdate.mockRejectedValue(simulatedError);
        mockFs.existsSync.mockReturnValue(true);
        const req = { params: { id: 'u1' }, body: {}, file: { filename: 'nueva.png' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(mockFs.unlinkSync).toHaveBeenCalledWith('images/users/nueva.png');
        expect(res.json).toHaveBeenCalledWith({
            message: 'A ocurrido un error al actualizar el usuario',
            data: simulatedError,
        });
    });

    // Prueba 26 updateUser (catch sin archivo)
    test('updateUser debe responder error si falla y no hay archivo', async () => {
        // ARRANGE
        const simulatedError = new Error('Fallo actualizando');
        modelUsuer.findByIdAndUpdate.mockRejectedValue(simulatedError);
        const req = { params: { id: 'u1' }, body: { name: 'Ana' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: 'A ocurrido un error al actualizar el usuario',
            data: simulatedError,
        });
    });

    // Prueba 27 updateUser (catch con archivo que no existe en disco)
    test('updateUser no debe llamar unlinkSync en el catch si el archivo no existe', async () => {
        // ARRANGE
        const simulatedError = new Error('Fallo actualizando');
        modelUsuer.findById.mockResolvedValue(null);
        modelUsuer.findByIdAndUpdate.mockRejectedValue(simulatedError);
        mockFs.existsSync.mockReturnValue(false);
        const req = { params: { id: 'u1' }, body: {}, file: { filename: 'nueva.png' } };
        const res = { json: jest.fn() };

        // ACT
        await controllerUsers.updateUser(req, res);

        // ASSERT
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: 'A ocurrido un error al actualizar el usuario',
            data: simulatedError,
        });
    });
        // Prueba 28 forgotPassword (correo no existe: documenta el fallo actual)
    test('forgotPassword responde "mistake" dos veces si el correo no existe (falta return)', async () => {
        // ARRANGE
        modelUsuer.findOne.mockResolvedValue(null);
        const req = { body: { email: 'noexiste@mail.com' } };
        const res = { json: jest.fn() };

        // ACT
        await forgotPassword(req, res);

        // ASSERT
        expect(modelUsuer.findOne).toHaveBeenCalledWith({ email: 'noexiste@mail.com' });
        expect(res.json).toHaveBeenNthCalledWith(1, {
            result: 'mistake',
            message: 'El correo ingresado no se encuentra en nuestra base de datos',
            data: null,
        });
        // sin return, el código sigue, falla con null.password y el catch responde de nuevo
        expect(res.json).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                result: 'mistake',
                message: 'Error interno en el servidor',
            })
        );
        expect(mockSendMail).not.toHaveBeenCalled();
    });

    // Prueba 29 forgotPassword (éxito)
    test('forgotPassword debe guardar la nueva contraseña hasheada y enviar el correo', async () => {
        // ARRANGE
        process.env.EMAIL_NODE = 'soporte@test.com';
        process.env.PASS_NODE = 'clave-test';
        const usuario = {
            name: 'Ana',
            password: 'hash-viejo',
            save: jest.fn().mockResolvedValue(),
        };
        modelUsuer.findOne.mockResolvedValue(usuario);
        mockBcrypt.hash.mockResolvedValue('hash-temporal');
        mockSendMail.mockResolvedValue({});
        const req = { body: { email: 'ana@mail.com' } };
        const res = { json: jest.fn() };

        // ACT
        await forgotPassword(req, res);

        // ASSERT
        // la contraseña aleatoria son 6 bytes en hexadecimal = 12 caracteres
        expect(mockBcrypt.hash).toHaveBeenCalledWith(
            expect.stringMatching(/^[0-9a-f]{12}$/),
            12
        );
        const passwordTemporal = mockBcrypt.hash.mock.calls[0][0];

        expect(usuario.password).toBe('hash-temporal');
        expect(usuario.save).toHaveBeenCalled();
        expect(mockCreateTransport).toHaveBeenCalledWith({
            service: 'gmail',
            auth: { user: 'soporte@test.com', pass: 'clave-test' },
        });
        expect(mockSendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                from: 'soporte@test.com',
                to: 'ana@mail.com',
                subject: 'Recuperacion de contraseña',
                text: expect.stringContaining(passwordTemporal),
            })
        );
        expect(res.json).toHaveBeenCalledWith({
            result: 'fine',
            message: 'se ha enviado una nueva contraseña al correo registrado',
        });
    });

    // Prueba 30 forgotPassword (catch: falla el envío del correo)
    test('forgotPassword debe responder error interno si falla el envío del correo', async () => {
        // ARRANGE
        process.env.EMAIL_NODE = 'soporte@test.com';
        process.env.PASS_NODE = 'clave-test';
        const usuario = { name: 'Ana', save: jest.fn().mockResolvedValue() };
        modelUsuer.findOne.mockResolvedValue(usuario);
        mockBcrypt.hash.mockResolvedValue('hash-temporal');
        mockSendMail.mockRejectedValue(new Error('Fallo SMTP'));
        const req = { body: { email: 'ana@mail.com' } };
        const res = { json: jest.fn() };

        // ACT
        await forgotPassword(req, res);

        // ASSERT
        expect(res.json).toHaveBeenCalledWith({
            result: 'mistake',
            message: 'Error interno en el servidor',
            error: 'Fallo SMTP',
        });
    });
});