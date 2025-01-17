import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../componentes/AuthContext'; // ajuste o caminho conforme necessário

export const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const navigation = useNavigation();
    const { token, setToken } = useAuth();

    const obterToken = async () => {
        try {
            const response = await axios.post('http://10.0.2.2:8000/api/token/', {
                username: "smartuser",
                password: "senai"
            });
            const token = response.data.access;
            console.log('Token obtido:', token);
            setToken(token);
        } catch (error) {
            console.error('Erro ao obter token:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        obterToken();
    }, []);

    const fazerLogin = async () => {
        if (!token) {
            console.error('Token não disponível');
            return;
        }

        try {
            const response = await axios.post(
                'http://10.0.2.2:8000/api/token/',
                {
                    username: usuario,
                    password: senha
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const token = response.data.access;
            console.log('Login bem-sucedido:', token);
            setToken(token); // Atualiza o token no contexto
            navigation.navigate('rotasTab');
        } catch (error) {
            console.error('Erro de login:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <View style={estilos.container}>
            <Image
                style={estilos.logo}
                source={require('../../assets/logo.png')}
            />
            <TextInput
                style={estilos.campo}
                placeholder='Usuário'
                placeholderTextColor='#e1e5f2'
                onChangeText={setUsuario}
                value={usuario}
            />
            <TextInput
                style={estilos.campo}
                placeholder='Senha'
                placeholderTextColor='#e1e5f2'
                secureTextEntry={true}
                onChangeText={setSenha}
                value={senha}
            />
            <TouchableOpacity
                style={estilos.botao}
                onPress={fazerLogin}
            >
                <Text style={estilos.textoBotao}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={estilos.cadastro}
                onPress={() => navigation.navigate('cadastro')}>
                <Text style={estilos.textoCadastro}>Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    );
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    campo: {
        height: 50,
        width: 300,
        backgroundColor: '#4f030a',
        color: '#fff',
        marginVertical: 5,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    botao: {
        height: 50,
        width: 300,
        backgroundColor: '#4f030a',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 20,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
    },
    cadastro: {
        width: 300,
        alignItems: 'flex-end'
    },
    textoCadastro: {
        color: '#fff',
        fontSize: 16,
    },
    logo: {
        height: 105,
        width: 170,
        marginBottom: 50,
        marginTop: -155
    }
});
