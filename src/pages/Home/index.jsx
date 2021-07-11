import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Text, Alert, FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import moment from 'moment';
import { formatNumber } from 'react-native-currency-input';
import api from '../config/configApi';


const Separator = () => (
    <View style={styles.separator} />
);


export default function Home() {

    const navigator = useNavigation();
    const [lancamentos, setLacamentos] = useState('');

    const getLancamentos = async () => {
        try {
            const res = await api.get('/listar/07/2021');

            setLacamentos(res.data.lancamentos);
        } catch (error) {
            Alert.alert("", "Erro: nenhum lançamentos encontrados, tente mais tarde!");
        }
    }

    useFocusEffect(
        useCallback(() => {
            getLancamentos();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.contentTitle}>
                    <Text>Listar informações financeiras</Text>
                    <TouchableOpacity onPress={() => navigator.navigate('Cadastro')}>
                        <Text>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
                <Separator />
                <FlatList
                    data={lancamentos}
                    renderItem={({ item }) => (
                        <View style={styles.contentFlatlist}>
                            <Text>{item.id}</Text>
                            <Text>{item.nome}</Text>
                            <Text>{
                                formatNumber(item.valor, {
                                    separator: ',',
                                    prefix: 'R$ ',
                                    precision: 2,
                                    delimiter: '.',
                                    signPosition: 'beforePrefix',
                                })
                            }
                            </Text>
                            <Text>{item.tipo}</Text>
                            <Text>{item.status}</Text>
                            <Text>{moment(item.vencimento).format('DD/MM/YYYY')}</Text>
                            <TouchableOpacity onPress={() => navigator.navigate('Edit', { idLancamento: item.id })} >
                                <Text>Editar</Text>

                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={lancamento => String(lancamento.id)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    content: {
        flex: 1,
        margin: 8,
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderRadius: 8,
    },

    contentTitle:{
        display:'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    contentFlatlist: {
        marginTop: 24,
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
    },

    separator: {
        marginTop: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});