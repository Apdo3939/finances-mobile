import React, { useState, useEffect } from 'react';
import { Alert, Text, StyleSheet, TextInput, ScrollView, Button, View } from 'react-native';
import moment from 'moment';
import { formatNumber } from 'react-native-currency-input';

import api from '../config/configApi';
import { useNavigation } from '@react-navigation/native';

const Separator = () => (
    <View style={styles.separator} />
);

export default function Edit({ route }) {

    const navigator = useNavigation();

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('');
    const [status, setStatus] = useState('');
    const [vencimento, setVencimento] = useState('');

    const [valorReal, setValorReal] = useState('');

    const handleConvertValor = async (valorInput) => {
        var valorInputConvertido = await valorInput.toString().replace(/\D/g, "");
        valorInputConvertido = valorInputConvertido.replace(/(\d)(\d{2})$/, "$1,$2");
        valorInputConvertido = valorInputConvertido.replace(/(?=(\d{3})+(\D))\B/g, ".");
        setValorReal(valorInputConvertido);

        var valorSalvar = await valorInputConvertido.replace(".", "");
        valorSalvar = await valorSalvar.replace(",",".");
        setValor(valorSalvar);

    }

    const listarLancamentos = async () => {
        const { idLancamento } = route.params;
        setId(idLancamento);

        try {
            const res = await api.get("/visualizar/" + idLancamento);
            setNome(res.data.lancamento.nome);
            setValor(res.data.lancamento.valor);
            setValorReal(formatNumber(res.data.lancamento.valor, {
                separator: ',',
                precision: 2,
                delimiter: '.'
            }));
            setTipo(res.data.lancamento.tipo);
            setStatus(res.data.lancamento.status);
            setVencimento(res.data.lancamento.vencimento);

        } catch (error) {
            if (error.res) {
                Alert.alert("", err.res.data.message);
            } else {
                Alert.alert("", "Erro: Tente mais tarde");
            }
        }
    }

    const handleEdit = async () => {

        const headers = { 'Content-Type': 'application/json' }

        await api.put('/editar',
            {
                id,
                nome,
                valor,
                tipo,
                status,
                vencimento

            }, { headers })
            .then(res => {
                Alert.alert("", res.data.message);
                navigator.navigate('Home');
            })
            .catch(err => {
                if (err.res) {
                    Alert.alert("", err.res.data.message);
                } else {
                    Alert.alert("", "Erro: tente mais tarde!");
                }
            });
    }

    useEffect(() => { listarLancamentos(); }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>Editar</Text>
                <Text>Id do lançamento: {id}</Text>

                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={text => setNome(text)}
                    placeholder='Digite o nome do lançamento'
                />

                <TextInput
                    style={styles.input}
                    value={valorReal}
                    onChangeText={text => handleConvertValor(text)}
                    placeholder='Digite o valor do lançamento'
                />

                <TextInput
                    style={styles.input}
                    value={tipo}
                    onChangeText={text => setTipo(text)}
                    placeholder='Digite o tipo do lançamento'
                />

                <TextInput
                    style={styles.input}
                    value={status}
                    onChangeText={text => setStatus(text)}
                    placeholder='Digite o status do lançamento'
                />

                <TextInput
                    style={styles.input}
                    value={vencimento}
                    onChangeText={text => setVencimento(text)}
                    placeholder='Digite o vencimento do lançamento'
                />
                <View>
                    <Button
                        title="Editar"
                        onPress={handleEdit}
                        accessibilityLabel="Botão para editar o lançamento."
                    />
                </View>
                <Separator />

            </View>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    input: {
        height: 40,
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderRadius: 8,
    },

    separator: {
        margin: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});