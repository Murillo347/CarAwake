//PS: Os dados nas telas: home, home2, relatorio e relatorio2, são fictícios e servem só como exemplo por enquanto.

import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

export default function Relatorio({ navigation }) {

    const [registrado, setRegistrado] = useState(false);

    return (

        <SafeAreaView style={styles.container}>

            <View style={styles.header}>

                <Text style={styles.headerIcon}>
                    ▤
                </Text>

                <Text style={styles.headerTitle}>
                    Relatório da corrida
                </Text>

            </View>

            <View style={styles.statsCard}>

                <View style={styles.statsHeader}>
                    <Text style={styles.statsTitle}>
                        Estatísticas
                    </Text>

                    <Text style={styles.arrow}>
                        ▼
                    </Text>
                </View>

                <View style={styles.statsContainer}>

                    <Stat title="Viagem" value="17" color="#54a9d4" />
                    <Stat title="Quilometragem" value="18.2" color="#54a9d4" />
                    <Stat title="Tempo (min)" value="28:21" color="#54a9d4" />

                    <Stat title="Bocejos" value="4" color="#e5d600" />
                    <Stat title="Piscadas longas" value="3" color="#e5d600" />
                    <Stat title="Pausas sugeridas" value="0" color="#64b45b" />

                </View>

            </View>

            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => setRegistrado(true)}
            >
                <Text style={styles.registerText}>
                    Registrar relatório
                </Text>
            </TouchableOpacity>

            {registrado && (
                <Text style={styles.successText}>
                    Registrado com sucesso!
                </Text>
            )}

            <TouchableOpacity
                style={styles.continueButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.continueText}>
                    Prosseguir
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

function Stat({ title, value, color }) {

    return (

        <View style={styles.stat}>

            <Text style={styles.statTitle}>
                {title}
            </Text>

            <View style={styles.statBox}>

                <Text style={[styles.statValue, { color }]}>
                    {value}
                </Text>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#03050d',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: 70,
        borderWidth: 2,
        borderColor: '#596172',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
    },

    headerIcon: {
        color: '#7ee5df',
        fontSize: 22,
        marginRight: 8,
    },

    headerTitle: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '600',
    },

    statsCard: {
        width: '76%',
        height: 177,
        marginTop: 35,
        borderRadius: 12,
        backgroundColor: '#181b24',
        borderWidth: 1,
        borderColor: '#565b68',
        overflow: 'hidden',
    },

    statsHeader: {
        height: 25,
        backgroundColor: '#2b2e38',
        borderBottomWidth: 1,
        borderBottomColor: '#555b68',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        borderRadius: 10,
    },

    statsTitle: {
        color: '#6ec4eb',
        fontSize: 13,
        fontWeight: '600',
    },

    arrow: {
        color: '#6bc3e8',
        fontSize: 10,
    },

    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        paddingTop: 8,
    },

    stat: {
        width: '31%',
        alignItems: 'center',
        marginBottom: 7,
    },

    statTitle: {
        color: '#7f9cad',
        fontSize: 9,
        marginBottom: 3,
        textAlign: 'center',
    },

    statBox: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#292c35',
        borderWidth: 1,
        borderColor: '#454a56',
        justifyContent: 'center',
        alignItems: 'center',
    },

    statValue: {
        fontSize: 22,
        fontWeight: '600',
    },

    registerButton: {
        width: 155,
        height: 37,
        marginTop: 21,
        borderRadius: 7,
        backgroundColor: '#181c28',
        borderWidth: 1,
        borderColor: '#596579',
        justifyContent: 'center',
        alignItems: 'center',
    },

    registerText: {
        color: '#a8d8ff',
        fontSize: 14,
        fontWeight: '600',
    },

    successText: {
        color: '#6d9fc4',
        fontSize: 11,
        marginTop: 7,
    },

    continueButton: {
        width: 155,
        height: 37,
        marginTop: 57,
        borderRadius: 7,
        backgroundColor: '#151b1c',
        borderWidth: 1,
        borderColor: '#4b8056',
        justifyContent: 'center',
        alignItems: 'center',
    },

    continueText: {
        color: '#a1ef88',
        fontSize: 14,
        fontWeight: '600',
    },

});
