import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

export default function Config({ navigation }) {

    return (

        <SafeAreaView style={styles.container}>

            <View style={styles.header}>

                <Text style={styles.headerIcon}>   ⚙</Text>

                <Text style={styles.headerTitle}>Configurações</Text>

            </View>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>

                <Text style={styles.optionIcon}>
                    🌐
                </Text>

                <Text style={styles.optionText}>
                    Linguagem: PT-BR
                </Text>

            </TouchableOpacity>

            <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate('Config2')}
            >

                <Text style={styles.optionIcon}>
                    ◐
                </Text>

                <Text style={styles.optionText}>
                    Modo de luz: Escuro
                </Text>

            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#03050d',
        paddingHorizontal: 5,
    },

    header: {
        height: 74,
        borderWidth: 2,
        borderColor: '#596172',
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerIcon: {
        color: '#cbd0d6',
        fontSize: 28,
        marginRight: 12,
    },

    headerTitle: {
        color: '#aeb5c2',
        fontSize: 18,
        fontWeight: '600',
    },

    backButton: {
        width: 32,
        height: 32,
        marginTop: 20,
        marginLeft: 15,
        borderRadius: 6,
        backgroundColor: '#303542',
        borderWidth: 1,
        borderColor: '#5d6678',
        justifyContent: 'center',
        alignItems: 'center',
    },

    backText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
        marginTop: -2,
    },

    optionButton: {
        height: 38,
        marginHorizontal: 15,
        marginTop: 40,
        borderRadius: 20,
        backgroundColor: '#202635',
        borderWidth: 1,
        borderColor: '#596579',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },

    optionIcon: {
        color: '#d4d9e2',
        fontSize: 17,
        marginRight: 5,
    },

    optionText: {
        color: '#c7cddd',
        fontSize: 16,
        fontWeight: '600',
    },

});
