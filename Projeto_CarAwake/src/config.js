import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';

if (typeof global.__CAR_AWAKE_THEME__ === 'undefined') {
    global.__CAR_AWAKE_THEME__ = 'dark';
    global.__CAR_AWAKE_LISTENERS__ = new Set();
}

function useAppTheme() {
    const [themeMode, setThemeMode] = useState(global.__CAR_AWAKE_THEME__);

    useEffect(() => {
        const listener = (newTheme) => setThemeMode(newTheme);
        global.__CAR_AWAKE_LISTENERS__.add(listener);
        return () => global.__CAR_AWAKE_LISTENERS__.delete(listener);
    }, []);

    const setTheme = (mode) => {
        global.__CAR_AWAKE_THEME__ = mode;
        global.__CAR_AWAKE_LISTENERS__.forEach((fn) => fn(mode));
    };

    const toggleTheme = () => {
        setTheme(global.__CAR_AWAKE_THEME__ === 'dark' ? 'light' : 'dark');
    };

    const isDark = themeMode === 'dark';

    const colors = isDark
        ? {
              bg: '#09090B',
              surface: '#121215',
              surfaceElevated: '#18181C',
              border: '#27272A',
              textPrimary: '#FAFAFA',
              textSecondary: '#A1A1AA',
              textMuted: '#52525B',
              accentBg: '#FAFAFA',
              accentText: '#09090B',
          }
        : {
              bg: '#F4F4F5',
              surface: '#FFFFFF',
              surfaceElevated: '#FAFAFA',
              border: '#E4E4E7',
              textPrimary: '#09090B',
              textSecondary: '#52525B',
              textMuted: '#A1A1AA',
              accentBg: '#09090B',
              accentText: '#FAFAFA',
          };

    return { isDark, colors, toggleTheme, setTheme };
}

export default function Config({ navigation }) {
    const { isDark, colors, toggleTheme, setTheme } = useAppTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.bg}
            />

            <View style={styles.contentWrapper}>
                {/* CABEÇALHO COM NAVEGAÇÃO DE RETORNO */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                            styles.backButton,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            },
                        ]}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={[styles.backText, { color: colors.textPrimary }]}>
                            ← VOLTAR
                        </Text>
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                        CONFIGURAÇÕES
                    </Text>
                </View>

                {/* GRUPO DE PREFERÊNCIAS DO SISTEMA */}
                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    PREFERÊNCIAS GERAIS
                </Text>

                <View
                    style={[
                        styles.settingsGroup,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    {/* OPÇÃO 1: IDIOMA */}
                    <View
                        style={[
                            styles.settingRow,
                            { borderBottomColor: colors.border, borderBottomWidth: 1 },
                        ]}
                    >
                        <View>
                            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                                Idioma do Sistema
                            </Text>
                            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                                Sintetizador de voz e telemetria
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.badge,
                                {
                                    backgroundColor: colors.surfaceElevated,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Text style={[styles.badgeText, { color: colors.textPrimary }]}>
                                PT-BR
                            </Text>
                        </View>
                    </View>

                    {/* OPÇÃO 2: MODO DE LUZ (ALTERNADOR DIRETO) */}
                    <TouchableOpacity
                        activeOpacity={0.75}
                        style={styles.settingRow}
                        onPress={toggleTheme}
                    >
                        <View>
                            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                                Modo de Luz
                            </Text>
                            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                                {isDark
                                    ? 'Escuro (Alto contraste noturno)'
                                    : 'Claro (Alta visibilidade diurna)'}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles. badge,
                                {
                                    backgroundColor: colors.accentBg,
                                    borderColor: colors.accentBg,
                                },
                            ]}
                        >
                            <Text style={[styles.badgeText, { color: colors.accentText }]}>
                                {isDark ? 'ESCURO' : 'CLARO'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* SELETOR RÁPIDO SEGMENTADO */}
                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    SELEÇÃO DIRETA DE TEMA
                </Text>

                <View
                    style={[
                        styles.segmentedControl,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            styles.segmentButton,
                            isDark && { backgroundColor: colors.accentBg },
                        ]}
                        onPress={() => setTheme('dark')}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                { color: isDark ? colors.accentText : colors.textSecondary },
                            ]}
                        >
                            MODO ESCURO
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            styles.segmentButton,
                            !isDark && { backgroundColor: colors.accentBg },
                        ]}
                        onPress={() => setTheme('light')}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                { color: !isDark ? colors.accentText : colors.textSecondary },
                            ]}
                        >
                            MODO CLARO
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    header: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
    },
    backText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.2,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1.6,
    },
    sectionLabel: {
        marginTop: 32,
        marginBottom: 12,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    settingsGroup: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    settingRow: {
        paddingVertical: 20,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    settingSubtitle: {
        fontSize: 12,
        fontWeight: '400',
    },
    badge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
    },
    segmentedControl: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: 10,
        borderWidth: 1,
    },
    segmentButton: {
        flex: 1,
        height: 44,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    segmentText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.2,
    },
});