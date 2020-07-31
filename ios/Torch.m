//
//  Torch.m
//  LampVue
//
//  Created by Sam Phillips on 7/30/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Torch,NSObject)
RCT_EXTERN_METHOD(turnOn)
RCT_EXTERN_METHOD(turnOff)
RCT_EXTERN_METHOD(getTorchStatus: (RCTResponseSenderBlock)callback)
@end
