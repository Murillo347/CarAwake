//PS: Os dados mostrados nas telas: home, home2, relatorio e relatorio2, são fictícios e servem apenas como exemplo por enquanto.

import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

export default function Home2({ navigation }) {

    return (

        <SafeAreaView style={styles.container}>

            {/* Cabeçalho */}
            <View style={styles.header}>

                <View style={styles.logoContainer}>

                    <Text style={styles.logo}>
                        CarAwake
                    </Text>

                    <View style={styles.onlineDot} />

                </View>

                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('Config2')}
                >
                    <Text style={styles.settings}>
                        ⚙
                    </Text>
                </TouchableOpacity>

            </View>

            {/* Botão iniciar viagem */}
            <View
                style={styles.tripCard}>

                {/* Status */}
                <View style={styles.statusCard}>

                    <View style={styles.statusItem}>

                        <Text style={styles.statusText}>
                            IA Facial:
                        </Text>

                        <Text style={styles.activeText}>
                            ● Ativada
                        </Text>

                    </View>

                    <View style={styles.statusItem}>

                        <Text style={styles.statusText}>
                            Localização:
                        </Text>

                        <Text style={styles.activeText}>
                            ● Ativada
                        </Text>

                    </View>

                </View>

                {/* Botão */}
                <TouchableOpacity style={
                    styles.startButton
                }
                    onPress={() => { navigation.navigate('Viagem2') }}
                >

                    <Text style={styles.play}>
                        ▶
                    </Text>

                    <Text style={styles.startText}>
                        INICIAR VIAGEM
                    </Text>

                </TouchableOpacity>

            </View>

            {/* Histórico */}
            <View style={styles.historyCard}>

                <View style={styles.historyHeader}>

                    <Text style={styles.historyTitle}>
                        Histórico semanal
                    </Text>

                    <Text style={styles.arrow}>
                        ▼
                    </Text>

                </View>

                <View style={styles.statsContainer}>

                    <Stat
                        title="Viagens"
                        value="17"
                        color="#4651b8"
                    />

                    <Stat
                        title="Quilometragem"
                        value="129.6"
                        color="#4651b8"
                    />

                    <Stat
                        title="Tempo (h)"
                        value="08:31"
                        color="#4651b8"
                    />

                    <Stat
                        title="Bocejos"
                        value="9"
                        color="#e5d600"
                    />

                    <Stat
                        title="Piscadas longas"
                        value="3"
                        color='#176049'
                    />

                    <Stat
                        title="Pausas sugeridas"
                        value="1"
                        color='#176049'
                    />

                </View>

            </View>

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

                <Text
                    style={[
                        styles.statValue,
                        { color }
                    ]}
                >
                    {value}
                </Text>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#7379ee',
        paddingHorizontal: 20,
    },

    /* Cabeçalho */

    header: {
        marginTop: 20,
        height: 75,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    logoContainer: {
        marginHorizontal: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },

    logo: {
        color: '#11152a',
        fontSize: 30,
        fontWeight: '700',
    },

    onlineDot: {
        width: 7,
        height: 7,
        borderRadius: 5,
        backgroundColor: '#65bd65',
        marginLeft: 5,
    },

    settingsButton: {
        width: 30,
        height: 30,
        borderRadius: 6,
        backgroundColor: '#9095ff',
        borderWidth: 1,
        borderColor: '#596579',
        justifyContent: 'center',
        alignItems: 'center',
    },

    settings: {
        color: '#11152a',
        fontSize: 20,
    },

    /* Status */

    statusCard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 20,
        borderWidth: 1,
        borderColor: '#20284a',
        borderRadius: 10,
        backgroundColor: '#9095ff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    statusItem: {
        flexDirection: 'row',
        marginHorizontal: 5,
    },

    statusText: {
        color: '#171b32',
        fontSize: 10,
    },

    activeText: {
        color: '#006b15',
        fontSize: 10,
        marginLeft: 2,
    },

    /* Card da viagem */

    tripCard: {
        height: 100,
        borderRadius: 12,
        backgroundColor: '#878dff',
        borderWidth: 1,
        borderColor: '#20284a',
        marginTop: 60,
        marginBottom: 10,
        marginHorizontal: 30,
        alignItems: 'center',
        position: 'relative',
    },

    startButton: {
        width: '80%',
        height: 30,
        marginVertical: 40,
        borderRadius: 6,
        backgroundColor: '#9095ff',
        borderWidth: 1,
        borderColor: '#596579',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    play: {
        color: '#176049',
        fontSize: 9,
        marginRight: 8,
    },

    startText: {
        color: '#11152a',
        fontSize: 10,
        fontWeight: '600',
    },

    /* Histórico */

    historyCard: {
        marginTop: 40,
        marginHorizontal: 30,
        backgroundColor: '#878dff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#20284a',
        paddingBottom: 10,
        overflow: 'hidden',
    },

    historyHeader: {
        height: 29,
        backgroundColor: '#9095ff',
        borderBottomWidth: 1,
        borderBottomColor: '#596579',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        borderRadius: 20,
    },

    historyTitle: {
        color: '#171b32',
        fontSize: 10,
        fontWeight: '600',
    },

    arrow: {
        color: '#176049',
        fontSize: 10,
    },

    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingTop: 10,
    },

    stat: {
        width: '31%',
        alignItems: 'center',
        marginBottom: 8,
    },

    statTitle: {
        color: '#30385e',
        fontSize: 9,
        marginBottom: 4,
        textAlign: 'center',
    },

    statBox: {
        width: '100%',
        height: 40,
        borderRadius: 8,
        backgroundColor: '#9095ff',
        borderWidth: 1,
        borderColor: '#596579',
        justifyContent: 'center',
        alignItems: 'center',
    },

    statValue: {
        fontSize: 18,
        fontWeight: '600',
    },

});