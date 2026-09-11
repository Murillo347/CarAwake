import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

export default function Config2({ navigation }) {

    return (

        <SafeAreaView style={styles.container}>

            {/* Cabeçalho */}
            <View style={styles.header}>

                <Text style={styles.headerIcon}>   ⚙</Text>

                <Text style={styles.headerTitle}>
                    Configurações
                </Text>

            </View>

            {/* Botão voltar */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('Home2')}
            >
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

            {/* Linguagem */}
            <TouchableOpacity style={styles.optionButton}>

                <Text style={styles.optionIcon}>
                    🌐
                </Text>

                <Text style={styles.optionText}>
                    Linguagem: PT-BR
                </Text>

            </TouchableOpacity>

            {/* Modo de luz */}
            <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate('Config')}
            >

                <Text style={styles.optionIcon}>
                    ◐
                </Text>

                <Text style={styles.optionText}>
                    Modo de luz: Claro
                </Text>

            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#7379ee',
        paddingHorizontal: 5,
    },

    /* Cabeçalho */

    header: {
        height: 74,
        borderWidth: 2,
        borderColor: '#596172',
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        backgroundColor: '#9095ff',
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerIcon: {
        color: '#11152a',
        fontSize: 28,
        marginRight: 12,
    },

    headerTitle: {
        color: '#11152a',
        fontSize: 18,
        fontWeight: '600',
    },

    /* Voltar */

    backButton: {
        width: 32,
        height: 32,
        marginTop: 20,
        marginLeft: 15,
        borderRadius: 6,
        backgroundColor: '#9095ff',
        borderWidth: 1,
        borderColor: '#20284a',
        justifyContent: 'center',
        alignItems: 'center',
    },

    backText: {
        color: '#171b32',
        fontSize: 20,
        fontWeight: '600',
        marginTop: -2,
    },

    /* Opções */

    optionButton: {
        height: 38,
        marginHorizontal: 15,
        marginTop: 40,
        borderRadius: 20,
        backgroundColor: '#9095ff',
        borderWidth: 1,
        borderColor: '#20284a',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },

    optionIcon: {
        color: '#20243c',
        fontSize: 17,
        marginRight: 5,
    },

    optionText: {
        color: '#171b32',
        fontSize: 16,
        fontWeight: '600',
    },

});