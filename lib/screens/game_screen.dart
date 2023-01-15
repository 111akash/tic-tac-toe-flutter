import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tic_tac_toe/provider/room_data_provider.dart';

class GameScreen extends StatefulWidget {
  static String routeName = '/game';
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  @override
  Widget build(BuildContext context) {
    // print(Provider.of<RoomDataProvider>(context).player1.nickname);
    // print(Provider.of<RoomDataProvider>(context).player2.nickname);
    // print('abc');
    RoomDataProvider roomDataProvider = Provider.of<RoomDataProvider>(context);

    return Scaffold(
      body: roomDataProvider.roomData['isJoin'] ? Center(
        child: Text(
          Provider.of<RoomDataProvider>(context).roomData.toString(),
        ),
      ),
    );
  }
}
