import {StyleSheet, Text, View, ScrollView, Pressable} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {useEffect, useMemo, useState} from 'react';
import {useMnemonicStore} from '@/stores/useMnemonicStore';
import {useAccountStore} from "@/stores/useAccountStore";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function BackupScreen() {
    const { readMnemonic } = useAccountStore()
    const insets = useSafeAreaInsets();
    const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const hasMnemonic = useMemo(() => mnemonicWords.length > 0, [mnemonicWords]);

    useEffect(() => {
        const setup = async () => {
            const mnemonicWords = await readMnemonic();
            setMnemonicWords(mnemonicWords);
        };

        void setup();

        return () => {
            setMnemonicWords([]);
        }
    }, [readMnemonic, setMnemonicWords]);

    const handleCopy = async () => {
        const phrase = mnemonicWords!.join(' ')
        await Clipboard.setStringAsync(phrase);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.block}>
                <Text style={styles.title}>Backup Your Recovery Phrase</Text>
                <Text style={styles.hint}>Never share these words with anyone.</Text>
                {hasMnemonic && (
                    <View style={styles.inlineActions}>
                        <Pressable onPress={handleCopy} accessibilityRole="button">
                            <Text style={styles.link}>{copied ? 'Copied!' : 'Copy phrase'}</Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {hasMnemonic ? (
                <View style={styles.wordsGrid}>
                    {mnemonicWords!.map((w, i) => (
                        <View key={`${w}-${i}`} style={styles.wordItem}>
                            <Text style={styles.wordIndex}>{i + 1}.</Text>
                            <Text style={styles.wordText}>{w}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.block}>
                    <Text style={styles.noMnemonic}>No mnemonic found in memory.</Text>
                    <Text style={styles.noMnemonicSub}>Create or restore a wallet first.</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    block: {
        gap: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
    },
    hint: {
        color: '#888',
    },
    inlineActions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 6,
    },
    link: {
        color: '#007AFF',
        fontWeight: '500',
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    wordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    wordIndex: {
        color: '#666',
        marginRight: 6,
    },
    wordText: {
        fontWeight: '500',
    },
    noMnemonic: {
        fontSize: 16,
        fontWeight: '500',
    },
    noMnemonicSub: {
        color: '#666',
    },
});
