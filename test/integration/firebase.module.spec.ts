import {FirebaseModule} from "../../src/firebase.module";
import {FirebaseConfig} from "../../src/firebase.config";
export function main() {
    describe("FirebaseModule", function () {
        describe(".forRoot()", function () {
            it("should return an object that provides the given config object", () => {
                var config = {
                    apiKey: "TestKey",
                    authDomain: "AuthDomain",
                    databaseURL: "TestUrl"
                };
                var result = FirebaseModule.forRoot(config);

                expect(result).not.toBeNull();
                var providers: any[] = result.providers;
                expect(providers.length).toBe(1);
                expect(providers[0].provide).toBe(FirebaseConfig);
                expect(providers[0].useValue).toBe(config);
            });
        });
    });
}