import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, Text, TextInput, StyleSheet, Button, Alert, View, Platform } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import api from '../config/configApi';

const Separator = () => (
    <View style={styles.separator} />
);

export default function Cadastro() {

    const navigator = useNavigation();

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('');
    const [status, setStatus] = useState('');
    const [vencimento, setVencimento] = useState('');
    const [date, setDate] = useState(new Date(moment()));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [valorReal, setValorReal] = useState('');

    const handleConvertValor = async (valorInput) => {
        var valorInputConvertido = await valorInput.toString().replace(/\D/g, "");
        valorInputConvertido = valorInputConvertido.replace(/(\d)(\d{2})$/, "$1,$2");
        valorInputConvertido = valorInputConvertido.replace(/(?=(\d{3})+(\D))\B/g, ".");
        setValorReal(valorInputConvertido);

        var valorSalvar = await valorInputConvertido.replace(".", "");
        valorSalvar = await valorSalvar.replace(",", ".");
        setValor(valorSalvar);

    }

    const handleCreateLancamento = async () => {
        await api.post('/cadastrar',
            {
                nome,
                valor,
                tipo,
                status,
                vencimento
            })
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

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios' ? true : false);
        setDate(currentDate);
        setVencimento(currentDate);
    };

    return (
        <ScrollView>
            <Text>Cadastrar</Text>
            <Separator />
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
            <View>
                <Button
                    title={moment(date).format("DD/MM/YYYY")}
                    onPress={showDatepicker}
                    color="#1C73B4"
                    accessibilityLabel="Botão para editar o vencimento."
                />
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>
            
            <View style={styles.radioButton}>
                <Text style={styles.textRadioButton}>Tipo</Text>
                <RadioButton
                    value="1"
                    status={tipo === 1 ? 'checked' : 'unchecked'}
                    onPress={() => setTipo(1)}
                />
                <Text style={styles.textRadioButton}>Débito</Text>
                <RadioButton
                    value="2"
                    status={tipo === 2 ? 'checked' : 'unchecked'}
                    onPress={() => setTipo(2)}
                />
                <Text style={styles.textRadioButton}>Crédito</Text>
            </View>

            <View style={styles.radioButton}>
                <Text style={styles.textRadioButton}>Status</Text>
                <RadioButton
                    value="1"
                    status={status === 1 ? 'checked' : 'unchecked'}
                    onPress={() => setStatus(1)}
                />
                <Text style={styles.textRadioButton}>Pendente</Text>

                <RadioButton
                    value="2"
                    status={status === 2 ? 'checked' : 'unchecked'}
                    onPress={() => setStatus(2)}
                />
                <Text style={styles.textRadioButton}>Efetuado</Text>
            </View>
            <Button
                title="Cadastrar"
                color="#000077"
                onPress={handleCreateLancamento}
                accessibilityLabel="Botão para cadastrar o lançamento."
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },

    content: {
        display: 'flex',
        padding: 8,
        margin: 8,
        borderWidth: 1,
        borderRadius: 8,
    },

    contentTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: 8,
        marginVertical: 16,
    },

    contentCardLancamento: {
        display: 'flex',
        padding: 8,
        margin: 8,
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 16,
    },

    input: {
        height: 40,
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderRadius: 8,
    },

    radioButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },

    textRadioButton: {
        width: 60,
        textAlign: 'left',
    },

    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});