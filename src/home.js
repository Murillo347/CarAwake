//PS: Os dados nas telas: home, home2, relatorio e relatorio2, são fictícios e servem só como exemplo por enquanto.

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

export default function Home({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>     CarAwake</Text>
                    <View style={styles.onlineDot} />
                </View>

                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('Config')}>
                    <Text style={styles.settings}>⚙</Text>
                </TouchableOpacity>
            </View>

            <View
                style={styles.tripCard}>

                <View style={styles.statusCard}>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusText}>IA Facial:</Text>
                        <Text style={styles.activeText}>● Ativada</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <Text style={styles.statusText}>Localização:</Text>
                        <Text style={styles.activeText}>● Ativada</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => { navigation.navigate('Viagem') }}
                >
                    <Text style={styles.play}>▶</Text>
                    <Text style={styles.startText}>INICIAR VIAGEM</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.historyCard}>

                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>Histórico semanal</Text>
                    <Text style={styles.arrow}>▼</Text>
                </View>

                <View style={styles.statsContainer}>

                    <Stat
                        title="Viagens"
                        value="17"
                        color="#54a9d4"
                    />

                    <Stat
                        title="Quilometragem"
                        value="129.6"
                        color="#54a9d4"
                    />

                    <Stat
                        title="Tempo (h)"
                        value="08:31"
                        color="#54a9d4"
                    />

                    <Stat
                        title="Bocejos"
                        value="9"
                        color="#e5d600"
                    />

                    <Stat
                        title="Piscadas longas"
                        value="3"
                        color="#64b45b"
                    />

                    <Stat
                        title="Pausas sugeridas"
                        value="1"
                        color="#64b45b"
                    />

                </View>
            </View>

        </SafeAreaView>
    );
}

function Stat({ title, value, color }) {
    return (
        <View style={styles.stat}>
            <Text style={styles.statTitle}>{title}</Text>

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
        paddingHorizontal: 20,
    },

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
        color: '#f1f1f1',
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
        backgroundColor: '#343b45',
        justifyContent: 'center',
        alignItems: 'center',
    },

    settings: {
        color: '#cbd0d6',
        fontSize: 20,
    },

    statusCard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 20,
        borderWidth: 1,
        borderColor: '#606673',
        borderRadius: 10,
        backgroundColor: '#171a23',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    statusItem: {
        flexDirection: 'row',
        marginHorizontal: 5,
    },

    statusText: {
        color: '#b9bec8',
        fontSize: 10,
    },

    activeText: {
        color: '#60b960',
        fontSize: 10,
        marginLeft: 2,
    },

    tripCard: {
        height: 100,
        borderRadius: 12,
        backgroundColor: '#181b24',
        borderWidth: 1,
        borderColor: '#565b68',
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
        backgroundColor: '#303543',
        borderWidth: 1,
        borderColor: '#5d6678',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    play: {
        color: '#7ee5df',
        fontSize: 9,
        marginRight: 8,
    },

    startText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '600',
    },

    historyCard: {
        marginTop: 40,
        marginHorizontal: 30,
        backgroundColor: '#181b24',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#565b68',
        paddingBottom: 10,
        overflow: 'hidden',
    },

    historyHeader: {
        height: 29,
        backgroundColor: '#2b2e38',
        borderBottomWidth: 1,
        borderBottomColor: '#555b68',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        borderRadius: 20,
    },

    historyTitle: {
        color: '#6ec4eb',
        fontSize: 10,
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
        paddingHorizontal: 8,
        paddingTop: 10,
    },

    stat: {
        width: '31%',
        alignItems: 'center',
        marginBottom: 8,
    },

    statTitle: {
        color: '#7f9cad',
        fontSize: 9,
        marginBottom: 4,
        textAlign: 'center',
    },

    statBox: {
        width: '100%',
        height: 40,
        borderRadius: 8,
        backgroundColor: '#292c35',
        borderWidth: 1,
        borderColor: '#454a56',
        justifyContent: 'center',
        alignItems: 'center',
    },

    statValue: {
        fontSize: 18,
        fontWeight: '600',
    },

});
