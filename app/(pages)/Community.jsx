import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import BottomNavigation from './BottomNavigation';
import Connection from './CommunityPageSubComponant/Connection';
import Channels from './CommunityPageSubComponant/Channels';
import Feed from './CommunityPageSubComponant/Feed';
import Header from './Header';

const YourComponent = () => {
    const [activeTab, setActiveTab] = useState('Connections');

    const renderContent = () => {
        switch (activeTab) {
            case 'Connections':
                return <Connection />;
            case 'Feed':
                return <Feed />;
            case 'Channels':
                return <Channels />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: -10 }}>
                    <View style={[styles.tabWrapper, activeTab === 'Feed' && styles.activeTab, { width: 60 }]}>
                        <Text
                            style={styles.tabs}
                            onPress={() => setActiveTab('Feed')}
                        >
                            Feed
                        </Text>
                    </View>
                    <View style={[styles.tabWrapper, activeTab === 'Connections' && styles.activeTab, { width: 115 }]}>
                        <Text
                            style={styles.tabs}
                            onPress={() => setActiveTab('Connections')}
                        >
                            Connections
                        </Text>
                    </View>
                    <View style={[styles.tabWrapper, activeTab === 'Channels' && styles.activeTab, { width: 90 }]}>
                        <Text
                            style={styles.tabs}
                            onPress={() => setActiveTab('Channels')}
                        >
                            Channels
                        </Text>
                    </View>
                </View>
                {renderContent()}
            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollViewContent: {
        paddingTop: 20,
        paddingLeft: 15,
        paddingRight: 15,
    },
    tabs: {
        marginLeft: 10,
        color: colors.loginPageTextColor,
        fontFamily: fonts.inter400,
        fontSize: 16,
    },
    activeTab: {
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderColor: colors.loginPageTextColor,

    },
});

export default YourComponent;