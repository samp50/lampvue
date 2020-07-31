//
//  Torch.swift
//  LampVue
//
//  Created by Sam Phillips on 7/30/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import Firebase

@objc(Torch) class Torch: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {return true}
  
  @objc static var isOn = false
  
  // Adapted from https://auth0.com/docs/api-auth/tutorials/nonce#generate-a-cryptographically-random-nonce
  private func randomNonceString(length: Int = 32) -> String {
    precondition(length > 0)
    let charset: Array<Character> =
        Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")
    var result = ""
    var remainingLength = length

    while remainingLength > 0 {
      let randoms: [UInt8] = (0 ..< 16).map { _ in
        var random: UInt8 = 0
        let errorCode = SecRandomCopyBytes(kSecRandomDefault, 1, &random)
        if errorCode != errSecSuccess {
          fatalError("Unable to generate nonce. SecRandomCopyBytes failed with OSStatus \(errorCode)")
        }
        return random
      }

      randoms.forEach { random in
        if remainingLength == 0 {
          return
        }

        if random < charset.count {
          result.append(charset[Int(random)])
          remainingLength -= 1
        }
      }
    }

    return result
  }

  
  @objc func turnOn() {
    print("Starting turnOn")
    Torch.isOn = true
    // Begin Sign in With Apple stuff here
    print("Sign in With Apple logs below here")
    //FirebaseApp.configure()
    let handle = Auth.auth().addStateDidChangeListener { (auth, user) in
      // ...
    }
    let nonceResult = randomNonceString()
    print("nonceResult is \(nonceResult)")
  }
  @objc func turnOff() {
    Torch.isOn = false
  }
  @objc func getTorchStatus(_ callback: RCTResponseSenderBlock) {
    print("Starting getTorchFunc")
    callback([NSNull(), Torch.isOn])
  }
}
